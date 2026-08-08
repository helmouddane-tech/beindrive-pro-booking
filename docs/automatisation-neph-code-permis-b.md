# Automatisation du parcours NEPH → Code → Conduite (permis B)

**Analyse d'architecture — intégration API Code'nGo! (Bureau Veritas) dans BeInDrive**

---

## 0. Levée d'ambiguïté sur le vocabulaire

Le numéro recherché s'écrit **NEPH** — *Numéro d'Enregistrement Préfectoral Harmonisé*
(« ENOH » est une transcription phonétique courante, mais aucun système ne l'expose sous ce nom).

C'est un identifiant **à 12 chiffres**, attribué **à vie** au candidat lors de sa première
inscription au permis, et **obligatoire** pour se présenter à l'épreuve théorique générale (ETG).
Les 6 premiers chiffres encodent l'année, le mois et le département d'inscription.

Deux durées à ne jamais confondre — elles pilotent tout le routage métier décrit plus bas :

| Objet | Durée | Effet à l'expiration |
|---|---|---|
| Le **NEPH** lui-même | attribué à vie, **désactivé après 6 ans** sans activité | à réactiver auprès de l'ANTS |
| L'**ETG** (le code) | **5 ans**, ou 5 présentations à l'épreuve pratique | il faut repasser le code |

---

## 1. Conclusion principale de l'analyse

> **L'API Code'nGo ne crée pas de NEPH. Elle le consomme.**

C'est le point structurant de toute la conception. Le NEPH est un **acte administratif de l'État**,
délivré par l'**ANTS / France Titres**, jamais par un opérateur d'examen agréé comme Bureau Veritas.
Aucun endpoint de `codengo.bureauveritas.fr` ne peut donc « générer » un numéro : l'API exige au
contraire un NEPH **déjà attribué et actif** comme donnée d'entrée pour inscrire un candidat à une session.

### Séparation des responsabilités

| Besoin métier | Système autoritaire | Automatisable par API ? |
|---|---|---|
| **Créer** un NEPH | ANTS / France Titres | ❌ Aucune API publique |
| Vérifier qu'un NEPH est actif | ANTS (source de vérité) | ⚠️ Indirect — rejet à l'inscription Code'nGo |
| Chercher / réserver une session ETG | **Code'nGo (Bureau Veritas)** | ✅ API partenaire |
| Affecter un candidat à une session | **Code'nGo** | ✅ API partenaire |
| Annuler / reporter (≥ 24 h avant) | **Code'nGo** | ✅ API partenaire |
| Récupérer le résultat ETG (J+1) | **Code'nGo** | ✅ API partenaire |
| Réserver l'examen **pratique** | RdvPermis (ANTS) | ❌ Portail pro uniquement |
| Évaluation de départ, contrat, livret, planning | **BeInDrive** (ce dépôt) | ✅ Supabase |

**Reformulation de la demande initiale.** « Automatiser la création du NEPH » doit se lire :
*automatiser la constitution, le dépôt et le suivi du dossier qui aboutit au NEPH* — pas un appel
API qui le fabrique. Ce qu'on automatise réellement, c'est la **checklist documentaire**, les
**relances**, le **suivi du délai (~10 jours)** et le **déblocage automatique de l'étape suivante**
dès que le numéro est saisi.

> ⚠️ **Accès à la documentation.** `codengo.bureauveritas.fr` est bloqué par la politique d'egress
> réseau de cette session : le Swagger (`/api/doc/`) n'a pas pu être lu. Les sections 5 à 7 sont donc
> conçues pour que **tout ce qui dépend du contrat exact de l'API soit isolé dans un seul fichier**
> (`endpoints.ts`), le reste étant écrit une fois pour toutes. La liste des points à confirmer figure
> en section 10.

---

## 2. Les trois systèmes en jeu

```
┌──────────────────────┐   dossier + pièces      ┌─────────────────────────┐
│  ANTS / France Titres│◄────────────────────────│  Auto-école (agrément    │
│  autoecole.ants.gouv │                         │  E-XX-XXX-XXXX)          │
│                      │─── NEPH (~10 j) ───────►│                          │
└──────────────────────┘                         │      BeInDrive           │
                                                 │   (React + Supabase)     │
┌──────────────────────┐  sessions, inscription  │                          │
│  Code'nGo            │◄────────────────────────│                          │
│  Bureau Veritas      │                         │                          │
│  (ETG agréé, 30 €)   │─── résultat J+1 ───────►│                          │
└──────────────────────┘                         └─────────────────────────┘
```

Deux environnements Code'nGo sont visibles publiquement — `codengo.bureauveritas.fr` (production)
et `codengo-ppd.bureauveritas.fr` (**pré-production**). Toute l'intégration doit être développée et
recettée sur `-ppd` : une réservation de siège en production est un **acte payant** (30 €, tarif
réglementé par l'État).

---

## 3. La machine à états du parcours élève

C'est le cœur de l'automatisation. Un élève n'est jamais « en cours d'inscription » de façon floue :
il occupe exactement **un** état, et chaque transition est déclenchée par un événement identifié.

```
                          ┌──────────┐
                          │ prospect │
                          └────┬─────┘
                               │ routeur d'entrée (§4)
                 ┌─────────────┴──────────────┐
         pas de NEPH                     NEPH fourni
                 │                            │
    ┌────────────▼─────────┐        ┌─────────▼──────────┐
    │ dossier_a_constituer │        │  neph_a_verifier   │
    └────────────┬─────────┘        └─────────┬──────────┘
       pièces complètes                       │ format OK
    ┌────────────▼─────────┐                  │
    │ dossier_depose_ants  │                  │
    └────────────┬─────────┘                  │
       NEPH saisi (~10 j)                     │
                 └───────────┬────────────────┘
                             ▼
                    ┌─────────────────┐
                    │  neph_attribue  │
                    └────────┬────────┘
              ┌──────────────┴───────────────┐
      ETG absent ou > 5 ans            ETG valide (< 5 ans)
              │                               │
   ┌──────────▼────────┐                      │
   │ code_a_planifier  │◄─────┐               │
   └──────────┬────────┘      │ échec         │
    réservation Code'nGo      │               │
   ┌──────────▼────────┐      │               │
   │   code_reserve    │──────┘               │
   └──────────┬────────┘                      │
     résultat = admis                         │
   ┌──────────▼────────┐                      │
   │   code_obtenu     │                      │
   └──────────┬────────┘                      │
              └──────────────┬────────────────┘
                             ▼
                  ┌─────────────────────┐
                  │ formation_conduite  │  ← évaluation de départ,
                  └──────────┬──────────┘    contrat, livret, leçons
                             ▼
                  ┌─────────────────────┐
                  │ pret_examen_pratique│  → RdvPermis (hors API)
                  └──────────┬──────────┘
                             ▼
                     ┌───────────────┐
                     │ permis_obtenu │
                     └───────────────┘
```

Deux états transverses complètent le graphe : `neph_inactif` (numéro dormant depuis plus de 6 ans,
à réactiver auprès de l'ANTS) et `abandonne`.

---

## 4. Le routeur d'entrée — « a-t-il déjà un numéro ? »

C'est précisément la bifurcation demandée : *soit on le positionne en code, soit on démarre son
apprentissage*. Elle se résout avec **trois questions** à l'inscription, et rien de plus.

1. Avez-vous déjà un NEPH ? *(12 chiffres)*
2. Avez-vous déjà obtenu le code ? *(si oui : date d'obtention)*
3. Catégorie visée ? *(B, B78 boîte automatique, AAC…)*

### Table de décision

| NEPH | ETG | Ancienneté ETG | → État cible | Action automatique déclenchée |
|---|---|---|---|---|
| ∅ | — | — | `dossier_a_constituer` | Ouvre la checklist ANTS + relances |
| fourni | non | — | `code_a_planifier` | **Propose les sessions Code'nGo** |
| fourni | oui | < 5 ans | `formation_conduite` | **Ouvre l'évaluation de départ + planning conduite** |
| fourni | oui | ≥ 5 ans | `code_a_planifier` | Code périmé → repositionne en code |
| fourni | oui | NEPH inactif > 6 ans | `neph_inactif` | Tâche admin : réactivation ANTS |

Cette logique est **pure** (aucune I/O) : elle doit vivre dans `src/features/enrollment/nephRouter.ts`
et être couverte par des tests unitaires Vitest — le harnais de test est déjà en place dans le dépôt.

### Validation du format NEPH

```
^\d{12}$      puis, à titre indicatif seulement :
  AA = année d'inscription     MM = mois (01–12)     DD = département
```

**Ne jamais bloquer une inscription sur ce contrôle.** Les cas Corse (2A/2B) et DOM (971–976) sortent
du gabarit à deux chiffres, et seule l'ANTS — ou le rejet par Code'nGo au moment de l'affectation —
fait foi. Le contrôle local sert à afficher un avertissement et à éviter une faute de frappe évidente,
pas à trancher.

---

## 5. Modèle de données (extension Supabase)

Le schéma actuel (`profiles`, `time_slots`, `bookings`, `student_progress`) couvre le planning mais
ignore totalement le volet administratif. Il faut l'étendre.

```sql
CREATE TYPE public.licence_category AS ENUM ('B','B78','AAC','A1','A2','A','BE');

CREATE TYPE public.neph_status AS ENUM (
  'absent','en_demande','declare','actif','inactif','invalide'
);

CREATE TYPE public.enrollment_status AS ENUM (
  'prospect','dossier_a_constituer','dossier_depose_ants','neph_a_verifier',
  'neph_attribue','neph_inactif','code_a_planifier','code_reserve','code_obtenu',
  'formation_conduite','pret_examen_pratique','permis_obtenu','abandonne'
);

-- Dossier administratif de l'élève (1–1 avec profiles)
CREATE TABLE public.student_files (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id        UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  licence_category  public.licence_category NOT NULL DEFAULT 'B',
  neph              TEXT UNIQUE CHECK (neph ~ '^[0-9]{12}$'),
  neph_status       public.neph_status NOT NULL DEFAULT 'absent',
  neph_requested_at DATE,
  neph_granted_at   DATE,
  ants_reference    TEXT,
  etg_obtained_at   DATE,
  etg_expires_at    DATE GENERATED ALWAYS AS (etg_obtained_at + INTERVAL '5 years') STORED,
  enrollment_status public.enrollment_status NOT NULL DEFAULT 'prospect',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Pièces justificatives du dossier ANTS
CREATE TABLE public.student_documents (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL,   -- 'identite' | 'domicile' | 'photo_signature' | 'jdc' | 'assr2'
  storage_path  TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'a_valider'
                CHECK (status IN ('a_valider','valide','refuse')),
  reviewed_by   UUID REFERENCES auth.users(id),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Inscriptions à l'ETG via Code'nGo
CREATE TABLE public.code_exam_registrations (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id           UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  idempotency_key      UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
  external_session_id  TEXT,
  external_booking_id  TEXT,
  center_name          TEXT,
  center_city          TEXT,
  scheduled_at         TIMESTAMPTZ,
  status               TEXT NOT NULL DEFAULT 'pending'
                       CHECK (status IN ('pending','confirmed','cancelled','failed','completed')),
  result               TEXT CHECK (result IN ('admis','non_admis','absent')),
  score                INT,
  result_received_at   TIMESTAMPTZ,
  last_error           TEXT,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Journal d'audit des appels sortants
CREATE TABLE public.integration_events (
  id           BIGSERIAL PRIMARY KEY,
  provider     TEXT NOT NULL DEFAULT 'codengo',
  operation    TEXT NOT NULL,
  student_id   UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  http_status  INT,
  ok           BOOLEAN NOT NULL,
  payload_hash TEXT,          -- surtout PAS le payload en clair
  error        TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

**RLS obligatoire sur les quatre tables**, en suivant exactement le motif déjà utilisé dans la
migration existante (`has_role(auth.uid(), 'admin')` + `auth.uid() = student_id`). Le NEPH et les
pièces d'identité sont des données personnelles sensibles : `integration_events` ne doit être lisible
que par les admins, et ne doit **jamais** stocker de payload en clair.

---

## 6. Architecture d'intégration technique

### La règle non négociable

> **Aucun appel à l'API Code'nGo depuis le navigateur.**

Les identifiants partenaire engagent l'agrément de l'auto-école et déclenchent des actes payants.
Dans une application Vite, tout ce qui est préfixé `VITE_` est **embarqué en clair dans le bundle**.
Les secrets Code'nGo doivent donc vivre exclusivement dans des **Supabase Edge Functions**.

```
Navigateur (React + TanStack Query)
   │  supabase.functions.invoke('codengo-…')   ← JWT élève / admin
   ▼
Edge Function (Deno)
   │  secrets : CODENGO_CLIENT_ID, CODENGO_CLIENT_SECRET, CODENGO_BASE_URL
   │  + contrôle de rôle, idempotence, journalisation
   ▼
API Code'nGo (Bureau Veritas)
```

### Découpage des fichiers

```
supabase/functions/
  _shared/codengo/
    endpoints.ts   ◄── LA SEULE zone à ajuster après lecture du Swagger
    client.ts          transport : OAuth2 + cache de token, retry, backoff, timeout
    schemas.ts         zod — validation des entrées ET des réponses
    errors.ts          taxonomie : NephRejected, SessionFull, RateLimited, …
  codengo-sessions-search/index.ts      GET  sessions par ville / rayon / période
  codengo-register-candidate/index.ts   POST affectation d'un candidat à une session
  codengo-cancel-registration/index.ts  POST annulation (garde-fou des 24 h)
  codengo-sync-results/index.ts         CRON récupération des résultats J+1

src/features/enrollment/
  nephRouter.ts       machine à états — pure, testable, sans I/O
  neph.ts             validation de format
  useEnrollment.ts    hooks TanStack Query
```

L'intérêt de ce découpage est direct : le contrat exact de l'API (chemins, noms de champs, forme de
l'authentification) est **confiné dans `endpoints.ts` et `schemas.ts`**. Le jour où le Swagger est
lisible, seuls ces deux fichiers changent — la machine à états, le modèle de données, les écrans et
les tests restent intacts.

### Cinq points de robustesse qui coûtent cher s'ils sont oubliés

1. **Idempotence.** Une place ETG coûte 30 €. La clé `idempotency_key` est générée et **persistée
   avant** l'appel réseau ; sur timeout on **rejoue la même clé**, on ne refait jamais un `POST` nu.
   Sans cela, un réseau instable produit des doubles facturations.
2. **Réconciliation.** Un secrétariat peut agir directement sur le portail Bureau Veritas, hors de
   l'application. Un job de rapprochement périodique état local ↔ état Code'nGo est indispensable,
   sinon les deux vérités divergent silencieusement.
3. **Fenêtre d'annulation de 24 h.** À encoder localement, pour désactiver le bouton « Annuler »
   côté élève avant que l'API ne renvoie une erreur — et surtout avant que la place ne soit perdue.
4. **Résultats à J+1.** Ne pas présumer l'existence d'un webhook. Prévoir un cron horaire qui
   interroge les sessions passées depuis moins de 72 h ; brancher le webhook plus tard s'il existe.
5. **NEPH rejeté par Code'nGo.** C'est le signal le plus fiable dont on dispose sur la validité réelle
   d'un numéro : basculer `neph_status` à `invalide`, sortir l'élève de `code_reserve` et ouvrir une
   tâche admin. C'est ce mécanisme qui remplace la vérification ANTS directe, indisponible.

---

## 7. Frontière de l'automatisable

### Automatisable dès maintenant, sans dépendance externe

- Le routeur d'entrée et toute la machine à états (§3–§4).
- La checklist documentaire ANTS : identité, justificatif de domicile, photo-signature numérique,
  JDC/ASSR selon l'âge — avec upload, validation par un admin et blocage tant que le dossier est incomplet.
- Les relances automatiques : pièce manquante, dossier déposé sans NEPH au-delà de ~10 jours,
  ETG approchant des 5 ans, NEPH approchant des 6 ans d'inactivité.
- Le déblocage automatique de l'étape suivante à la saisie du NEPH.

### Automatisable via l'API Code'nGo (après contractualisation)

- Recherche de sessions, réservation de sièges, affectation et modification des candidats,
  annulation/report, récupération des résultats.

### À ne pas automatiser — et c'est une décision d'architecture, pas une limite technique

Piloter le portail ANTS ou l'espace pro Code'nGo par **scraping ou RPA** est à proscrire :
c'est contraire aux conditions d'utilisation, structurellement fragile (toute évolution d'IHM casse
le robot), et cela ferait transiter des **pièces d'identité** hors de tout cadre contractuel de
sous-traitance RGPD. Le risque n'est pas technique, il est juridique et il porte sur l'agrément de
l'auto-école.

La création du NEPH est un acte administratif de l'État : elle reste manuelle côté ANTS. Ce qu'on
automatise autour d'elle — checklist, relances, suivi de délai, déblocage — élimine en pratique
l'essentiel de la charge de secrétariat.

---

## 8. Conformité

- **RGPD.** NEPH, date et lieu de naissance, pièces justificatives : données personnelles, dont
  certaines à fort impact. Appliquer la minimisation (ne pas dupliquer le NEPH dans les logs ni dans
  `integration_events`), une durée de conservation explicite, un bucket Storage privé, une RLS stricte
  et une journalisation des accès admin. Bureau Veritas est **sous-traitant** au sens de l'article 28 :
  l'annexe correspondante doit figurer au contrat partenaire.
- **Agrément.** L'accès à l'API partenaire suppose un agrément préfectoral d'enseignement
  (`E-XX-XXX-XXXX`) et un contrat partenaire Bureau Veritas actif.
- **Tarif réglementé.** L'ETG est à 30 €, fixé par l'État. Toute refacturation à l'élève doit être
  distinguée des frais de service de l'auto-école.
- **Âges.** ETG dès 15 ans en conduite accompagnée ; conduite autonome en B possible dès 17 ans
  depuis 2024. Ces seuils conditionnent les pièces exigées (ASSR2, JDC) — donc la checklist.

---

## 9. Plan de mise en œuvre

| Lot | Contenu | Dépendance externe |
|---|---|---|
| **0** | Contrat partenaire Bureau Veritas, accès Swagger, accès recette `codengo-ppd`, déblocage réseau du domaine | 🔴 Bloquant |
| **1** | Migration SQL + RLS, routeur d'entrée, écrans dossier/checklist, tests Vitest | 🟢 Aucune |
| **2** | Connecteur Code'nGo : recherche de sessions + inscription candidat | 🔴 Lot 0 |
| **3** | Synchronisation des résultats, réconciliation, relances | 🔴 Lot 0 |
| **4** | Branche conduite : évaluation de départ, contrat de formation, livret d'apprentissage | 🟢 Aucune |

Les lots **1 et 4 sont réalisables immédiatement** : ils ne dépendent ni du contrat partenaire ni du
déblocage réseau, et représentent la majorité de la valeur métier (le routage, la checklist, les
relances). Le connecteur Code'nGo ne conditionne que les lots 2 et 3.

---

## 10. À confirmer dans le Swagger

Ces points déterminent le contenu de `endpoints.ts` et `schemas.ts`, et rien d'autre.

1. **Authentification** — OAuth2 `client_credentials` ? clé d'API ? mTLS ? Durée de vie du jeton ?
2. **Le candidat est-il un objet persistant** (`/candidates`, réutilisable entre sessions) ou une
   donnée en ligne dans la réservation ? Cela décide si l'on stocke un `external_candidate_id`.
3. **Existe-t-il un endpoint de contrôle de NEPH** préalable à la réservation ? Si oui, il remplace
   avantageusement le mécanisme de rejet décrit en §6.5.
4. **Webhooks de résultat**, ou polling exclusivement ?
5. **En-tête d'idempotence** supporté (`Idempotency-Key`) ?
6. **Quotas et limitation de débit** — pour calibrer le backoff et la fréquence du cron.
7. **Modèle de paiement** — débit à la réservation, ou facturation mensuelle par prélèvement SEPA ?
   Cela change la gravité d'une double réservation.
8. **Nomenclature des catégories** attendue (`B`, `B78`, …) et champs obligatoires de l'affectation.

---

## Sources

- [Code'nGo! — Bureau Veritas](https://www.bureauveritas.fr/besoin/conduite-vers-la-reussite-lexamen-du-code-de-la-route-avec-codengo)
- [Rejoindre Code'nGo! en tant qu'auto-école partenaire](https://www.bureauveritas.fr/besoin/rejoindre-codengo-en-tant-quauto-ecole-ou-centre-dexamen-partenaire)
- [Code'nGo! — Savoir si mon NEPH est valide](https://codengo.bureauveritas.fr/portal/contenu/lexique/details/NEPH-valide)
- [ANTS / France Titres — Espace auto-école](https://autoecole.ants.gouv.fr/)
- [ANTS — Inscrire un élève à l'examen du permis de conduire](https://autoecole.ants.gouv.fr/demarches-en-ligne/-inscrire-un-eleve-a-l-examen-du-permis-de-conduire)
- [LegiPermis — Numéro de permis et code NEPH](https://www.legipermis.com/legislation/numero-permis-de-conduire.html)
