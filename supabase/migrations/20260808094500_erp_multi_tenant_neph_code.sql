-- =============================================================================
-- ERP auto-école — socle multi-établissement + domaine NEPH / examen du code
-- =============================================================================
-- Contexte : BeInDrive est un ERP destiné à plusieurs auto-écoles, pas un outil
-- interne. Deux conséquences structurelles traitées ici :
--
--   1. Le cloisonnement par établissement. La fonction has_role() existante est
--      GLOBALE : un utilisateur 'admin' voit tout. Acceptable pour un mono-
--      établissement, inadmissible dès le second. Les appartenances passent donc
--      par school_members, et les nouvelles policies sont scopées au tenant.
--
--   2. L'automatisation n'est jamais un prérequis. Chaque canal (ANTS, Code'nGo,
--      livret numérique) a un mode par établissement — manuel, assisté,
--      automatisé — et chaque enregistrement porte sa provenance, pour qu'une
--      synchronisation n'écrase jamais une saisie humaine.
--
-- Voir docs/automatisation-neph-code-permis-b.md
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Énumérations du domaine
-- -----------------------------------------------------------------------------

-- Rôles internes à un établissement. Volontairement distinct de app_role, qui
-- reste le rôle plateforme : ALTER TYPE ... ADD VALUE ne peut pas être utilisé
-- dans la même transaction que les policies qui s'y réfèrent.
CREATE TYPE public.tenant_role AS ENUM ('school_admin', 'instructor', 'student');

CREATE TYPE public.integration_mode AS ENUM ('manuel', 'assiste', 'automatise');

CREATE TYPE public.record_source AS ENUM ('api', 'manual', 'import');

CREATE TYPE public.licence_category AS ENUM ('B', 'B78', 'AAC', 'A1', 'A2', 'A', 'BE');

CREATE TYPE public.neph_status AS ENUM (
  'absent',             -- aucun numéro connu
  'en_demande',         -- dossier déposé à l'ANTS, en attente
  'declare',            -- saisi, non vérifié auprès du ministère
  'verifie_ministere',  -- confirmé par GET /candidates (Code'nGo)
  'invalide',           -- rejeté par le ministère
  'inactif'             -- dormant > 6 ans, réactivation ANTS nécessaire
);

CREATE TYPE public.enrollment_status AS ENUM (
  'prospect',
  'dossier_a_constituer',
  'dossier_depose_ants',
  'neph_a_verifier',
  'neph_attribue',
  'neph_invalide',
  'neph_inactif',
  'code_a_planifier',
  'code_reserve',
  'code_obtenu',
  'formation_conduite',
  'pret_examen_pratique',
  'permis_obtenu',
  'abandonne'
);

-- -----------------------------------------------------------------------------
-- 2. Établissements et appartenances
-- -----------------------------------------------------------------------------

CREATE TABLE public.driving_schools (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  agrement_number TEXT,                                   -- E-XX-XXX-XXXX
  aurige_number   TEXT,                                   -- identifiant métier
  siret           TEXT,
  contact_email   TEXT,
  is_active       BOOLEAN NOT NULL DEFAULT true,

  -- Mode par canal : un établissement peut être automatisé sur le code et
  -- manuel sur l'ANTS. Tout démarre en manuel — l'ERP fonctionne sans clé.
  ants_mode       public.integration_mode NOT NULL DEFAULT 'manuel',
  codengo_mode    public.integration_mode NOT NULL DEFAULT 'manuel',
  livret_mode     public.integration_mode NOT NULL DEFAULT 'manuel',

  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.school_members (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driving_school_id UUID NOT NULL REFERENCES public.driving_schools(id) ON DELETE CASCADE,
  user_id           UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role              public.tenant_role NOT NULL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (driving_school_id, user_id, role)
);

-- -----------------------------------------------------------------------------
-- 3. Fonctions d'autorisation (SECURITY DEFINER — évitent la récursion RLS)
-- -----------------------------------------------------------------------------

-- Rôle plateforme : l'éditeur. Distinct de l'admin d'un établissement.
CREATE OR REPLACE FUNCTION public.is_platform_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = 'admin'
  )
$$;

CREATE OR REPLACE FUNCTION public.is_school_member(_user_id UUID, _school_id UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.school_members
    WHERE user_id = _user_id AND driving_school_id = _school_id
  )
$$;

CREATE OR REPLACE FUNCTION public.has_school_role(
  _user_id UUID, _school_id UUID, _role public.tenant_role
)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.school_members
    WHERE user_id = _user_id AND driving_school_id = _school_id AND role = _role
  )
$$;

-- Raccourci de lecture : « cet utilisateur encadre-t-il cet établissement ? »
CREATE OR REPLACE FUNCTION public.is_school_staff(_user_id UUID, _school_id UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT public.has_school_role(_user_id, _school_id, 'school_admin')
      OR public.has_school_role(_user_id, _school_id, 'instructor')
      OR public.is_platform_admin(_user_id)
$$;

-- -----------------------------------------------------------------------------
-- 4. Secrets d'intégration par établissement
-- -----------------------------------------------------------------------------
-- La X-Auth-Partner-key est un secret PLATEFORME (variable d'environnement des
-- Edge Functions, pas en base). La X-Auth-Driving-School-key appartient en
-- revanche à chaque établissement : elle est stockée ici.
--
-- Cette table n'a VOLONTAIREMENT aucune policy : RLS activée sans policy = aucun
-- accès pour les rôles authenticated/anon. Seul service_role, qui contourne RLS
-- dans les Edge Functions, peut la lire. Une clé d'établissement ne doit jamais
-- atteindre le navigateur, pas même celui de son propre admin.
CREATE TABLE public.school_integration_credentials (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driving_school_id UUID NOT NULL REFERENCES public.driving_schools(id) ON DELETE CASCADE,
  provider          TEXT NOT NULL CHECK (provider IN ('codengo', 'ants', 'livret')),
  credential        TEXT NOT NULL,
  is_valid          BOOLEAN NOT NULL DEFAULT true,
  last_checked_at   TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (driving_school_id, provider)
);

-- -----------------------------------------------------------------------------
-- 5. Dossier administratif de l'élève
-- -----------------------------------------------------------------------------

CREATE TABLE public.student_files (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driving_school_id UUID NOT NULL REFERENCES public.driving_schools(id) ON DELETE CASCADE,
  student_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  licence_category  public.licence_category NOT NULL DEFAULT 'B',

  -- Longueur volontairement souple. Le NEPH français canonique compte 12
  -- chiffres, mais le Swagger Code'nGo donne des exemples à 14 et 16 : une
  -- contrainte stricte rejetterait des numéros que l'API accepte. Seul
  -- GET /candidates fait foi.
  neph              TEXT CHECK (neph ~ '^[0-9]{10,18}$'),
  neph_status       public.neph_status NOT NULL DEFAULT 'absent',
  neph_source       public.record_source NOT NULL DEFAULT 'manual',
  neph_checked_at   TIMESTAMPTZ,
  neph_requested_at DATE,
  neph_granted_at   DATE,
  ants_reference    TEXT,

  codengo_candidate_id BIGINT,

  etg_obtained_at   DATE,
  etg_expires_at    DATE GENERATED ALWAYS AS
                      ((etg_obtained_at + INTERVAL '5 years')::date) STORED,

  enrollment_status public.enrollment_status NOT NULL DEFAULT 'prospect',

  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (driving_school_id, student_id)
);

-- Un NEPH est national : il ne peut pas être partagé par deux dossiers, même
-- dans deux établissements différents.
CREATE UNIQUE INDEX idx_student_files_neph
  ON public.student_files(neph) WHERE neph IS NOT NULL;

CREATE UNIQUE INDEX idx_student_files_codengo_candidate
  ON public.student_files(codengo_candidate_id) WHERE codengo_candidate_id IS NOT NULL;

CREATE INDEX idx_student_files_school ON public.student_files(driving_school_id);
CREATE INDEX idx_student_files_status ON public.student_files(enrollment_status);

-- -----------------------------------------------------------------------------
-- 6. Pièces justificatives du dossier ANTS
-- -----------------------------------------------------------------------------

CREATE TABLE public.student_documents (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driving_school_id UUID NOT NULL REFERENCES public.driving_schools(id) ON DELETE CASCADE,
  student_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document_type     TEXT NOT NULL CHECK (document_type IN (
                      'identite', 'domicile', 'photo_signature',
                      'jdc', 'assr2', 'mandat', 'autre')),
  storage_path      TEXT,
  -- Le code e-photo n'est pas un fichier : c'est un code délivré par une cabine
  -- ou un photographe agréé. Première cause de rejet ANTS, d'où un champ dédié.
  ephoto_code       TEXT,
  issued_on         DATE,
  status            TEXT NOT NULL DEFAULT 'a_valider'
                      CHECK (status IN ('a_valider', 'valide', 'refuse')),
  rejection_reason  TEXT,
  reviewed_by       UUID REFERENCES auth.users(id),
  reviewed_at       TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT student_documents_has_content
    CHECK (storage_path IS NOT NULL OR ephoto_code IS NOT NULL)
);

CREATE INDEX idx_student_documents_student ON public.student_documents(student_id);
CREATE INDEX idx_student_documents_school ON public.student_documents(driving_school_id);

-- -----------------------------------------------------------------------------
-- 7. Inscriptions à l'examen du code (ETG)
-- -----------------------------------------------------------------------------

CREATE TABLE public.code_exam_registrations (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driving_school_id UUID NOT NULL REFERENCES public.driving_schools(id) ON DELETE CASCADE,
  student_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- 'manual' par défaut : une réservation prise par téléphone ou sur le portail
  -- Bureau Veritas est un cas normal, pas une exception.
  source            public.record_source NOT NULL DEFAULT 'manual',
  created_by        UUID REFERENCES auth.users(id),

  -- Renseigné dès qu'un humain corrige une ligne synchronisée. La
  -- réconciliation cesse alors de réécrire et signale la divergence.
  manual_override_at TIMESTAMPTZ,
  manual_override_by UUID REFERENCES auth.users(id),

  codengo_participation_id BIGINT,
  codengo_session_id       BIGINT,
  codengo_site_id          BIGINT,
  -- L'API ne connaît que deux catégories. Attention : la documentation Code'nGo
  -- se contredit sur leur sens (A=moto selon Participation, A=voiture selon
  -- ParticipationResults). À confirmer en recette avant d'exploiter le résultat.
  api_category      TEXT NOT NULL DEFAULT 'B' CHECK (api_category IN ('A', 'B')),

  site_name         TEXT,
  site_city         TEXT,
  scheduled_at      TIMESTAMPTZ,

  -- Statuts bruts de l'API, stockés sans réinterprétation.
  participation_status TEXT,
  payment_status       TEXT,
  payment_token        UUID DEFAULT gen_random_uuid(),  -- jeton opaque des rappels
  payment_url          TEXT,                            -- éphémère, à purger

  result_status      TEXT CHECK (result_status IN ('admis', 'non_admis', 'absent')),
  result_errors      INT,
  result_details     JSONB,        -- erreurs par thème → révision ciblée
  result_received_at TIMESTAMPTZ,
  convocation_path   TEXT,

  -- Fenêtre de remboursement : 3 jours avant la session (et non 24 h, qui est le
  -- délai d'annulation annoncé au public). Maintenue par trigger : l'opérateur
  -- timestamptz - interval est STABLE, donc inutilisable en colonne générée.
  refundable_until  TIMESTAMPTZ,

  last_error        TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_code_exam_participation
  ON public.code_exam_registrations(codengo_participation_id)
  WHERE codengo_participation_id IS NOT NULL;

CREATE INDEX idx_code_exam_student ON public.code_exam_registrations(student_id);
CREATE INDEX idx_code_exam_school ON public.code_exam_registrations(driving_school_id);
CREATE INDEX idx_code_exam_scheduled ON public.code_exam_registrations(scheduled_at);

CREATE OR REPLACE FUNCTION public.set_refundable_until()
RETURNS TRIGGER
LANGUAGE plpgsql SET search_path = public
AS $$
BEGIN
  NEW.refundable_until := CASE
    WHEN NEW.scheduled_at IS NULL THEN NULL
    ELSE NEW.scheduled_at - INTERVAL '3 days'
  END;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_code_exam_refundable
  BEFORE INSERT OR UPDATE OF scheduled_at ON public.code_exam_registrations
  FOR EACH ROW EXECUTE FUNCTION public.set_refundable_until();

-- -----------------------------------------------------------------------------
-- 8. Journal des transitions du parcours
-- -----------------------------------------------------------------------------
-- Toute transition forcée par un humain exige un motif. Cette table est ce qui
-- rend le parcours explicable à l'élève, et défendable en cas de litige.

CREATE TABLE public.enrollment_transitions (
  id                BIGSERIAL PRIMARY KEY,
  driving_school_id UUID NOT NULL REFERENCES public.driving_schools(id) ON DELETE CASCADE,
  student_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  from_status       public.enrollment_status,
  to_status         public.enrollment_status NOT NULL,
  source            public.record_source NOT NULL,
  actor_id          UUID REFERENCES auth.users(id),
  reason            TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT enrollment_transitions_manual_needs_reason
    CHECK (source <> 'manual' OR (reason IS NOT NULL AND length(btrim(reason)) > 0))
);

CREATE INDEX idx_enrollment_transitions_student
  ON public.enrollment_transitions(student_id, created_at DESC);

-- -----------------------------------------------------------------------------
-- 9. Divergences de synchronisation
-- -----------------------------------------------------------------------------
-- File de rapprochement. Le cas 'remote_only' correspond à une participation
-- réservée hors ERP (portail Bureau Veritas) : elle est importée, mais son
-- rattachement à un élève doit être confirmé par un humain.

CREATE TABLE public.sync_divergences (
  id                BIGSERIAL PRIMARY KEY,
  driving_school_id UUID NOT NULL REFERENCES public.driving_schools(id) ON DELETE CASCADE,
  provider          TEXT NOT NULL DEFAULT 'codengo',
  kind              TEXT NOT NULL CHECK (kind IN ('remote_only', 'field_conflict')),
  payload           JSONB NOT NULL,
  student_id        UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  registration_id   UUID REFERENCES public.code_exam_registrations(id) ON DELETE SET NULL,
  resolved_at       TIMESTAMPTZ,
  resolved_by       UUID REFERENCES auth.users(id),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_sync_divergences_open
  ON public.sync_divergences(driving_school_id) WHERE resolved_at IS NULL;

-- -----------------------------------------------------------------------------
-- 10. Journal d'audit des appels sortants
-- -----------------------------------------------------------------------------
-- Jamais de payload en clair : le NEPH, l'identité et les coordonnées y
-- transitent. Un hash suffit à tracer et à rapprocher.

CREATE TABLE public.integration_events (
  id                BIGSERIAL PRIMARY KEY,
  driving_school_id UUID REFERENCES public.driving_schools(id) ON DELETE SET NULL,
  provider          TEXT NOT NULL DEFAULT 'codengo',
  operation         TEXT NOT NULL,
  student_id        UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  http_status       INT,
  ok                BOOLEAN NOT NULL,
  payload_hash      TEXT,
  error             TEXT,
  duration_ms       INT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_integration_events_recent
  ON public.integration_events(provider, created_at DESC);

-- -----------------------------------------------------------------------------
-- 11. Déclencheurs updated_at
-- -----------------------------------------------------------------------------

CREATE TRIGGER update_driving_schools_updated_at
  BEFORE UPDATE ON public.driving_schools
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_school_credentials_updated_at
  BEFORE UPDATE ON public.school_integration_credentials
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_student_files_updated_at
  BEFORE UPDATE ON public.student_files
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_code_exam_updated_at
  BEFORE UPDATE ON public.code_exam_registrations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- -----------------------------------------------------------------------------
-- 12. Row Level Security
-- -----------------------------------------------------------------------------

ALTER TABLE public.driving_schools               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_members                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_integration_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_files                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_documents             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.code_exam_registrations       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollment_transitions        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sync_divergences              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integration_events            ENABLE ROW LEVEL SECURITY;

-- school_integration_credentials : aucune policy, volontairement. RLS active
-- sans policy interdit tout accès sauf service_role.

-- DRIVING_SCHOOLS
CREATE POLICY "Members can view their school"
  ON public.driving_schools FOR SELECT TO authenticated
  USING (public.is_school_member(auth.uid(), id) OR public.is_platform_admin(auth.uid()));

CREATE POLICY "School admins can update their school"
  ON public.driving_schools FOR UPDATE TO authenticated
  USING (public.has_school_role(auth.uid(), id, 'school_admin')
      OR public.is_platform_admin(auth.uid()));

CREATE POLICY "Platform admin can create schools"
  ON public.driving_schools FOR INSERT TO authenticated
  WITH CHECK (public.is_platform_admin(auth.uid()));

-- SCHOOL_MEMBERS
CREATE POLICY "Users can view own memberships"
  ON public.school_members FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Staff can view school memberships"
  ON public.school_members FOR SELECT TO authenticated
  USING (public.is_school_staff(auth.uid(), driving_school_id));

CREATE POLICY "School admins manage memberships"
  ON public.school_members FOR ALL TO authenticated
  USING (public.has_school_role(auth.uid(), driving_school_id, 'school_admin')
      OR public.is_platform_admin(auth.uid()))
  WITH CHECK (public.has_school_role(auth.uid(), driving_school_id, 'school_admin')
      OR public.is_platform_admin(auth.uid()));

-- STUDENT_FILES
CREATE POLICY "Students can view own file"
  ON public.student_files FOR SELECT TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Staff can view school files"
  ON public.student_files FOR SELECT TO authenticated
  USING (public.is_school_staff(auth.uid(), driving_school_id));

CREATE POLICY "Staff can manage school files"
  ON public.student_files FOR ALL TO authenticated
  USING (public.is_school_staff(auth.uid(), driving_school_id))
  WITH CHECK (public.is_school_staff(auth.uid(), driving_school_id));

-- STUDENT_DOCUMENTS
CREATE POLICY "Students can view own documents"
  ON public.student_documents FOR SELECT TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Students can upload own documents"
  ON public.student_documents FOR INSERT TO authenticated
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Staff can manage school documents"
  ON public.student_documents FOR ALL TO authenticated
  USING (public.is_school_staff(auth.uid(), driving_school_id))
  WITH CHECK (public.is_school_staff(auth.uid(), driving_school_id));

-- CODE_EXAM_REGISTRATIONS
CREATE POLICY "Students can view own registrations"
  ON public.code_exam_registrations FOR SELECT TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Staff can manage school registrations"
  ON public.code_exam_registrations FOR ALL TO authenticated
  USING (public.is_school_staff(auth.uid(), driving_school_id))
  WITH CHECK (public.is_school_staff(auth.uid(), driving_school_id));

-- ENROLLMENT_TRANSITIONS — lecture seule côté client, écriture par le serveur
CREATE POLICY "Students can view own transitions"
  ON public.enrollment_transitions FOR SELECT TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Staff can view school transitions"
  ON public.enrollment_transitions FOR SELECT TO authenticated
  USING (public.is_school_staff(auth.uid(), driving_school_id));

CREATE POLICY "Staff can record transitions"
  ON public.enrollment_transitions FOR INSERT TO authenticated
  WITH CHECK (public.is_school_staff(auth.uid(), driving_school_id));

-- SYNC_DIVERGENCES — affaire du personnel, jamais de l'élève
CREATE POLICY "Staff can manage school divergences"
  ON public.sync_divergences FOR ALL TO authenticated
  USING (public.is_school_staff(auth.uid(), driving_school_id))
  WITH CHECK (public.is_school_staff(auth.uid(), driving_school_id));

-- INTEGRATION_EVENTS — audit : admins d'établissement et plateforme uniquement
CREATE POLICY "School admins can read integration events"
  ON public.integration_events FOR SELECT TO authenticated
  USING (
    (driving_school_id IS NOT NULL
      AND public.has_school_role(auth.uid(), driving_school_id, 'school_admin'))
    OR public.is_platform_admin(auth.uid())
  );
