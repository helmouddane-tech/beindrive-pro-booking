# Automatisation du parcours NEPH → Code → Conduite (permis B)

**Analyse d'architecture — intégration API Code'nGo! (Bureau Veritas) dans BeInDrive**

> **Révision 2** — établie sur le contrat réel : `swagger-api-internet/swagger_v1.json`.
> La révision 1 était une conception à l'aveugle (domaine bloqué par la politique réseau).
> Les écarts entre les deux sont récapitulés en §01bis : **cinq points étaient faux**, dont
> le délai d'annulation et la contrainte de longueur du NEPH.

---

## 0. Levée d'ambiguïté sur le vocabulaire

Le numéro recherché s'écrit **NEPH** — *Numéro d'Enregistrement Préfectoral Harmonisé*
(« ENOH » est une transcription phonétique courante, mais aucun système ne l'expose sous ce nom).
Dans l'API Code'nGo il porte le nom de champ **`registrationNumber`**, documenté comme
*« Registration number (known as 'NEPH' in France) »*.

C'est un identifiant attribué **à vie** au candidat lors de sa première inscription au permis, et
**obligatoire** pour se présenter à l'épreuve théorique générale (ETG).

> ⚠️ **Ne pas contraindre le NEPH à 12 chiffres.** Le NEPH français canonique en compte 12, mais les
> exemples du Swagger montrent `16586546548787` (**14 chiffres**) et `1231578841412547`
> (**16 chiffres**). L'API n'impose aucune longueur. Une contrainte `CHECK (neph ~ '^[0-9]{12}$')`
> rejetterait des numéros que Code'nGo accepte. Voir §04.

Deux durées à ne jamais confondre — elles pilotent tout le routage métier décrit en §03 :

| Objet | Durée | Effet à l'expiration |
|---|---|---|
| Le **NEPH** lui-même | attribué à vie, **désactivé après 6 ans** sans activité | à réactiver auprès de l'ANTS |
| L'**ETG** (le code) | **5 ans**, ou 5 présentations à l'épreuve pratique | il faut repasser le code |

---

## 1. Conclusion principale — confirmée par le schéma

> **L'API Code'nGo ne crée pas de NEPH. Elle l'exige en entrée.**

Le Swagger tranche la question de façon explicite. L'endpoint `POST /api/v1/candidates` s'intitule
*« Create a candidate account »*, ce qui peut induire en erreur : il crée un **compte candidat dans
Code'nGo**, et son modèle `Candidate` marque `registrationNumber` comme **champ obligatoire**.

```
Candidate {
  gender*             MR | MME
  firstname*          Jean
  lastname*           Durand
  birthdate*          1981-05-22
  registrationNumber* 16586546548787   ← le NEPH, OBLIGATOIRE
  email*  phone*  zipCode*
  drivingSchoolRegistrationNumber      ← n° Aurige de l'auto-école
}
```

On ne peut donc pas créer un candidat sans posséder déjà son NEPH. Le numéro reste un **acte
administratif de l'État**, délivré par l'**ANTS / France Titres**.

### La bonne nouvelle : l'endpoint de contrôle existe

C'est le principal apport de la lecture du Swagger :

```
GET /api/v1/candidates    « Check if the candidate is known to the Ministry of the Interior »
→ CandidateCheck { valid: boolean }
```

Code'nGo interroge le **ministère de l'Intérieur** et répond `valid: true | false`. Cela donne
exactement ce qui manquait : un moyen de **valider un NEPH avant tout engagement financier**, sans
attendre le rejet d'une réservation. Cet endpoint devient la **porte d'entrée obligatoire** de tout
le parcours (§03).

### Séparation des responsabilités (mise à jour)

| Besoin métier | Système autoritaire | Endpoint / voie |
|---|---|---|
| **Créer** un NEPH | ANTS / France Titres | ❌ Aucune API — dossier au portail pro |
| **Vérifier** un NEPH auprès du ministère | Code'nGo (relais) | ✅ `GET /candidates` |
| Créer / mettre à jour un compte candidat | Code'nGo | ✅ `PUT /candidates` (upsert) |
| Lister les centres d'examen | Code'nGo | ✅ `GET /sites` |
| Chercher les sessions programmées | Code'nGo | ✅ `GET /sessions` |
| Inscrire des candidats (auto-école) | Code'nGo | ✅ `POST /sessions/{id}/participations` |
| Inscrire un candidat libre | Code'nGo | ✅ `POST /candidates/{id}/sessions/{sid}/participations` |
| Annuler une participation | Code'nGo | ✅ `DELETE /participations/{id}` |
| Convocation PDF | Code'nGo | ✅ `GET /participations/{id}/convocation` |
| Résultats (structurés + PDF) | Code'nGo | ✅ `GET /participations/{id}/results` + `/resultdetails` |
| Notification de résultat | Code'nGo | ✅ **Webhook** `POST /subscribe` |
| Réserver l'examen **pratique** | RdvPermis (ANTS) | ❌ Portail pro uniquement |
| Évaluation de départ, contrat, livret | BeInDrive | ✅ Supabase |

---

## 1bis. Ce que la lecture du Swagger corrige

Cinq points de la révision 1 étaient faux ou incomplets. Ils sont listés ici parce qu'ils changent le
code à écrire, pas seulement la prose.

| Sujet | Révision 1 (hypothèse) | Contrat réel | Impact |
|---|---|---|---|
| **Longueur du NEPH** | 12 chiffres, contrainte SQL stricte | Aucune longueur imposée ; exemples à **14 et 16 chiffres** | La contrainte `CHECK` aurait rejeté des numéros valides |
| **Délai d'annulation** | 24 h | **3 jours** avant la session pour être **remboursé** | Le garde-fou UI doit passer à J-3 |
| **Authentification** | OAuth2 `client_credentials` supposé | **Deux clés statiques** en en-tête HTTP | Pas de cache de jeton à écrire — beaucoup plus simple |
| **Résultats** | Cron de polling, webhook incertain | **Webhooks disponibles** (`/subscribe`) | Le cron devient un filet, plus le mécanisme principal |
| **Paiement** | Débit direct ou SEPA mensuel | **Redirection carte bancaire** avec 3 URLs de rappel | Change entièrement le design d'idempotence (§06) |

Deux ajouts que la révision 1 n'avait pas anticipés, et qui ont une vraie valeur produit :

- **La convocation PDF est récupérable par API** (`GET /participations/{id}/convocation`) — donc
  envoyable automatiquement à l'élève. Gain de secrétariat immédiat.
- **Les résultats sont détaillés par thème** (`ParticipationResultsDetails { code, label, errors }`,
  ex. thème `L` = *Dispositions légales en matière de circulation routière*, 2 erreurs). On peut donc
  **cibler la révision sur les thèmes échoués** au lieu d'annoncer un simple échec. C'est
  l'opportunité pédagogique la plus intéressante de toute l'API.

### Une incohérence dans la documentation, à ne pas recopier

Le sens des catégories est contradictoire d'un modèle à l'autre :

| Modèle | Ce que dit la doc |
|---|---|
| `CandidateIdParticipationCategory.category` | *'A' (for motorbike) or 'B' (for car)* |
| `Participation.category` | *A for motorbike or B for car* |
| `ParticipationResults.category` | *A for **car** or B for **motorbike*** ← **inversé** |

Deux occurrences contre une, et le bon sens métier (B = voiture en France) donnent :
**`A` = moto, `B` = voiture**. La description de `ParticipationResults` est une erreur de
documentation. À confirmer sur l'environnement de recette avant de câbler le mapping — c'est
typiquement le genre de détail qui produit un bug silencieux d'affichage de résultat.

---

## 2. Authentification et modèle de compte

Pas d'OAuth2 : **deux clés statiques** transmises en en-tête HTTP à chaque requête.

| En-tête | Portée | Obtention |
|---|---|---|
| `X-Auth-Partner-key` | **Toujours obligatoire** | Compte « Partner » à demander à **question.pro@codengo.fr** ; la clé arrive par courrier |
| `X-Auth-Driving-School-key` | Requis pour agir **en tant qu'auto-école** | Onglet « Mes informations » du portail Code'nGo, connecté comme auto-école |

Conséquence organisationnelle importante : le modèle est à **deux niveaux**. BeInDrive doit être
**partenaire** (l'éditeur du système d'information) *et* disposer d'un **compte auto-école** existant
sur `codengo.bureauveritas.fr/portal/`. Ces deux démarches sont distinctes et doivent être lancées en
parallèle — c'est le chemin critique du projet (§08, lot 0).

Quand `X-Auth-Driving-School-key` est fourni, le champ `drivingSchoolRegistrationNumber` (le numéro
**Aurige** de l'auto-école) devient inutile dans le corps des requêtes. Il ne sert qu'au cas du
candidat libre, sans auto-école rattachée.

### Variables d'environnement à prévoir

Aucune n'existe aujourd'hui dans `.env`, et **aucune ne doit être préfixée `VITE_`** — voir §05.

```
CODENGO_BASE_URL              https://codengo-ppd.bureauveritas.fr   (recette)
CODENGO_PARTNER_KEY           secret
CODENGO_DRIVING_SCHOOL_KEY    secret
CODENGO_AURIGE_NUMBER         n° d'agrément auto-école
```

---

## 3. La décision d'architecture centrale : quel flux d'inscription ?

L'API expose **deux chemins mutuellement exclusifs** pour inscrire un candidat à une session, chacun
avec un accès restreint. C'est le choix structurant du projet.

| | Voie auto-école | Voie candidat |
|---|---|---|
| Endpoint | `POST /sessions/{id}/participations` | `POST /candidates/{id}/sessions/{sessionId}/participations` |
| Accès | *Restricted Access : **Driving school only*** | *Restricted Access : **Candidate only*** |
| Volume | **Plusieurs candidats** en une requête | Un seul candidat |
| Visibilité | `GET /sessions/{id}/participations` — liste tous les inscrits de la session (*driving school only*) | — |

**Recommandation : la voie auto-école.** BeInDrive est une auto-école, pas une place de marché : elle
inscrit ses élèves, doit voir la liste de ses inscrits sur une session, et gagne à réserver en lot.
La voie candidat ne se justifierait que pour des « candidats libres » sans rattachement, cas qui n'est
pas celui du produit.

Ce choix a une conséquence à ne pas manquer : `GET /sessions/{id}/participations` est réservé à
l'auto-école. C'est **l'endpoint de réconciliation** (§06) — il permet de comparer l'état local à
l'état réel chez Bureau Veritas. Il n'existe pas dans la voie candidat.

---

## 4. Le parcours complet, endpoint par endpoint

### 4.1 Machine à états et routeur d'entrée

Le routage se résout avec **trois questions** à l'inscription — c'est la bifurcation « positionner en
code » vs « démarrer l'apprentissage » :

1. Avez-vous déjà un NEPH ?
2. Avez-vous déjà obtenu le code, et à quelle date ?
3. Quelle catégorie visez-vous ? *(B, B78 boîte auto, AAC → tous mappés sur `B` côté API)*

| NEPH | ETG | Ancienneté | → État cible | Action déclenchée |
|---|---|---|---|---|
| ∅ | — | — | `dossier_a_constituer` | Checklist ANTS + relances (aucun appel API) |
| fourni | non | — | `neph_a_verifier` → `code_a_planifier` | **`GET /candidates`** puis proposition de sessions |
| fourni | oui | < 5 ans | `neph_a_verifier` → `formation_conduite` | Évaluation de départ + planning conduite |
| fourni | oui | ≥ 5 ans | `neph_a_verifier` → `code_a_planifier` | Code périmé → repositionne en code |
| fourni | — | NEPH inactif > 6 ans | `neph_inactif` | Tâche admin : réactivation ANTS |

Le passage par `neph_a_verifier` n'est plus un contrôle de format heuristique comme en révision 1 :
c'est un **appel réel à `GET /candidates`**, qui interroge le ministère de l'Intérieur. Un
`valid: false` bascule l'élève en `neph_invalide` et ouvre une tâche admin — avant toute dépense.

Cette logique reste **pure** (aucune I/O) et doit vivre dans
`src/features/enrollment/nephRouter.ts`, couverte par des tests Vitest ; le harnais est déjà en place.

### 4.2 Séquence d'inscription au code (voie auto-école)

```
1.  GET  /api/v1/candidates?registrationNumber=…&lastname=…&birthdate=…
        → CandidateCheck { valid }
        ⛔ GATE : si valid=false, on s'arrête ici. Rien n'est engagé.

2.  PUT  /api/v1/candidates          ← upsert, donc REJOUABLE sans doublon
        body: Candidate { gender, firstname, lastname, birthdate,
                          registrationNumber, email, phone, zipCode }
        → id du candidat Code'nGo, à persister

3.  GET  /api/v1/sites               → Site[] { name, city, lat, lng,
                                                hasHandicapAccess, capacity }
    GET  /api/v1/sessions            → Session[] { siteId, scheduleStartDate,
                                                   capacity, remainingCapacity,
                                                   hasHandicapAccess, status }

4.  POST /api/v1/sessions/{id}/participations       ← driving school only
        candidats : CandidateIdParticipationCategory[] { id | registrationNumber, category }
        paiement  : ParticipationRequest { paymentOKCallbackURL,
                                           paymentKOCallbackURL,
                                           paymentCancelledCallbackURL }
        → ParticipationPending[] { id, paymentURL }

5.  Redirection de l'élève vers paymentURL (page carte bancaire)
        → retour sur l'une des 3 URLs de rappel

6.  GET  /api/v1/participations/{id}/convocation     → PDF à envoyer à l'élève

7.  POST /api/v1/subscribe                          → webhook de résultat
        ← CandidateResultWebhook { candidate { id, registrationNumber },
                                   participationResults { status, errors, details[] } }

8.  GET  /api/v1/participations/{id}/results        → détail par thème
    GET  /api/v1/participations/{id}/resultdetails  → PDF
```

> **Point à vérifier en recette.** Le Swagger fourni liste les endpoints et les modèles, mais pas la
> composition exacte du corps de `POST /sessions/{id}/participations`. Le modèle
> `CandidateIdParticipationCategory` et le modèle `ParticipationRequest` doivent y être combinés —
> reste à confirmer s'ils sont deux propriétés d'un même objet ou une autre structure. Idem pour les
> paramètres de requête de `GET /candidates` (probablement NEPH + identité, puisque le ministère
> vérifie la cohérence de l'ensemble).

### 4.3 Les 11 statuts de participation à mapper

Le statut est la source de vérité du parcours. Il doit être stocké tel quel et traduit à l'affichage,
jamais réinterprété.

| Statut Code'nGo | Sens | État BeInDrive |
|---|---|---|
| `NOT_CONFIRMED` | Non confirmé (souvent : non payé) | `code_reserve` — paiement en attente |
| `CONFIRMED` | Confirmé | `code_reserve` |
| `ENDED_WAITING_FOR_RESULTS` | Examen passé, résultats non reçus | `code_reserve` |
| `DELAY` | Attente des 24 h avant résultat | `code_reserve` |
| `SUCCESS` | Réussi | **`code_obtenu`** → ouvre la conduite |
| `FAILED` | Échoué | `code_a_planifier` (retour en boucle) |
| `ABSENT` | Candidat absent | `code_a_planifier` + alerte admin |
| `ABORTED` | Interrompu pendant la session | `code_a_planifier` + alerte admin |
| `DISPUTE_REPORTED` | Invalidé pour litige | `code_a_planifier` + tâche admin |
| `CANCELLED_WITH_REFUND` | Annulé et remboursé | `code_a_planifier` |
| `CANCELLED_WITHOUT_REFUND` | Annulé sans remboursement | `code_a_planifier` + **perte de 30 €** |

Statuts de paiement en parallèle : `FREE`, `EXPECTED`, `PAID`, `NOT_PAID`.

**Trois statuts méritent une alerte admin explicite** — `ABSENT`, `ABORTED`, `DISPUTE_REPORTED` — car
ils signalent un incident, pas un simple échec pédagogique, et le traitement diffère.

---

## 5. Modèle de données (révisé)

Le schéma actuel (`profiles`, `time_slots`, `bookings`, `student_progress`) couvre le planning mais
ignore le volet administratif.

```sql
CREATE TYPE public.licence_category AS ENUM ('B','B78','AAC','A1','A2','A','BE');
CREATE TYPE public.neph_status AS ENUM
  ('absent','en_demande','declare','verifie_ministere','invalide','inactif');

CREATE TYPE public.enrollment_status AS ENUM (
  'prospect','dossier_a_constituer','dossier_depose_ants','neph_a_verifier',
  'neph_attribue','neph_invalide','neph_inactif','code_a_planifier','code_reserve',
  'code_obtenu','formation_conduite','pret_examen_pratique','permis_obtenu','abandonne'
);

CREATE TABLE public.student_files (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id        UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  licence_category  public.licence_category NOT NULL DEFAULT 'B',

  -- Longueur volontairement souple : l'API n'impose rien et ses exemples
  -- vont de 12 à 16 chiffres. Seul GET /candidates fait foi.
  neph              TEXT UNIQUE CHECK (neph ~ '^[0-9]{10,18}$'),
  neph_status       public.neph_status NOT NULL DEFAULT 'absent',
  neph_checked_at   TIMESTAMPTZ,            -- horodatage du GET /candidates
  codengo_candidate_id BIGINT UNIQUE,       -- id retourné par PUT /candidates

  neph_requested_at DATE,
  ants_reference    TEXT,
  etg_obtained_at   DATE,
  etg_expires_at    DATE GENERATED ALWAYS AS (etg_obtained_at + INTERVAL '5 years') STORED,
  enrollment_status public.enrollment_status NOT NULL DEFAULT 'prospect',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.code_exam_registrations (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id             UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  codengo_participation_id BIGINT UNIQUE,   -- clé de réconciliation
  codengo_session_id       BIGINT,
  codengo_site_id          BIGINT,
  api_category           TEXT NOT NULL DEFAULT 'B' CHECK (api_category IN ('A','B')),

  scheduled_at           TIMESTAMPTZ,
  -- Statut brut de l'API, stocké sans réinterprétation
  participation_status   TEXT,
  payment_status         TEXT,
  payment_url            TEXT,              -- éphémère, à purger après usage

  result_status          TEXT,
  result_errors          INT,
  result_details         JSONB,             -- erreurs par thème → révision ciblée
  result_received_at     TIMESTAMPTZ,
  convocation_path       TEXT,              -- PDF dans Supabase Storage

  -- Fenêtre de remboursement : 3 jours avant la session, pas 24 h
  refundable_until       TIMESTAMPTZ GENERATED ALWAYS AS
                           (scheduled_at - INTERVAL '3 days') STORED,

  created_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Plus : student_documents (pièces ANTS)
--        integration_events (audit : opération, http_status, ok, hash — jamais de payload clair)
```

Deux colonnes générées portent des règles métier au niveau de la base, là où le code ne peut pas s'en
écarter : `etg_expires_at` (les 5 ans du code) et `refundable_until` (les 3 jours de Code'nGo).

**RLS obligatoire sur les quatre tables**, sur le motif déjà employé dans la migration existante —
`has_role(auth.uid(), 'admin')` combiné à `auth.uid() = student_id`. Le NEPH, la date de naissance et
les pièces justificatives sont des données personnelles : `integration_events` ne doit être lisible
que par les admins et ne doit **jamais** stocker de payload en clair.

---

## 6. Architecture d'intégration

### La règle non négociable

> **Aucun appel à l'API Code'nGo depuis le navigateur.**

Les deux clés d'authentification engagent l'agrément de l'auto-école et permettent d'inscrire des
candidats à des sessions payantes. Dans une application Vite, tout ce qui est préfixé `VITE_` est
**embarqué en clair dans le bundle**. Les clés doivent donc vivre exclusivement dans des **Supabase
Edge Functions**.

```
Navigateur (React + TanStack Query)
   │  supabase.functions.invoke('codengo-…')     ← JWT élève / admin
   ▼
Edge Function (Deno)
   │  secrets : CODENGO_PARTNER_KEY, CODENGO_DRIVING_SCHOOL_KEY, CODENGO_BASE_URL
   │  + contrôle de rôle, journalisation, mapping d'erreurs
   ▼
API Code'nGo — en-têtes X-Auth-Partner-key / X-Auth-Driving-School-key
```

À cela s'ajoutent **quatre routes publiques** que l'architecture de la révision 1 n'avait pas prévues,
parce que le mode de paiement était inconnu :

```
supabase/functions/
  _shared/codengo/
    endpoints.ts   chemins /api/v1/… (le versioning est noté /api/v*/ dans la doc — à figer)
    schemas.ts     zod : Candidate, Session, Site, Participation, ParticipationResults…
    client.ts      transport : en-têtes d'auth, retry, timeout, parsing des erreurs 400
    errors.ts      NephUnknown · SessionFull · Unauthorized · BusinessError(details[])

  codengo-check-neph/            GATE   GET  /candidates       → { valid }
  codengo-upsert-candidate/             PUT  /candidates       (idempotent)
  codengo-sites/                        GET  /sites
  codengo-sessions-search/              GET  /sessions
  codengo-register-participations/      POST /sessions/{id}/participations
  codengo-cancel-participation/         DELETE /participations/{id}
  codengo-fetch-convocation/            GET  /participations/{id}/convocation → Storage
  codengo-reconcile/             CRON   GET  /sessions/{id}/participations

  ── routes publiques (sans JWT, vérification par jeton opaque en query) ──
  codengo-payment-return/         3 cibles : OK / KO / CANCELLED
  codengo-webhook-results/        réception de CandidateResultWebhook

src/features/enrollment/
  nephRouter.ts     machine à états — pure, testable, sans I/O
  useEnrollment.ts  hooks TanStack Query
```

Les URLs de rappel de paiement et le webhook sont appelés **sans JWT Supabase** : Bureau Veritas ne
porte pas la session de l'utilisateur. Elles doivent donc être déclarées
`verify_jwt = false` dans `supabase/config.toml`, et se protéger autrement — un **jeton opaque à
usage unique** généré à la création de la participation et passé en paramètre d'URL, plus une
vérification systématique de l'état réel auprès de l'API avant d'écrire quoi que ce soit en base.
**Ne jamais faire confiance au contenu d'un rappel de paiement** pour confirmer une inscription :
on relit toujours le statut côté Code'nGo.

### Les points de robustesse, révisés

1. **Idempotence — le problème s'est déplacé.** Aucun en-tête `Idempotency-Key` n'est documenté, mais
   le paiement par redirection change la nature du risque : un `POST /participations` ne débite pas,
   il crée une participation `NOT_CONFIRMED` / `paymentStatus: EXPECTED`. Le danger n'est donc plus la
   double facturation mais les **participations orphelines** — créées, jamais payées, qui immobilisent
   une place sur `remainingCapacity`. Deux parades : `PUT /candidates` est un **upsert** donc
   rejouable sans doublon, et avant tout `POST` on vérifie
   `GET /candidates/{id}/participations` pour ne pas réinscrire un candidat déjà inscrit.
   Un job doit balayer les `NOT_CONFIRMED` anciennes et les annuler.

2. **Réconciliation.** Le secrétariat peut agir directement sur le portail Bureau Veritas, hors de
   l'application. `GET /sessions/{id}/participations` (réservé à l'auto-école) est l'endpoint qui
   permet de rapprocher les deux vérités. Sans ce job, l'écart se découvre le jour de l'examen.

3. **Fenêtre de remboursement : 3 jours, pas 24 h.** La doc est explicite —
   `CANCELLED_WITHOUT_REFUND` survient *« maybe because cancelled after delay : 3 days before
   session »*. La nuance à traduire correctement dans l'UI : l'élève **peut** encore annuler à moins
   de 3 jours, mais **ne sera plus remboursé**. Le bouton ne doit donc pas disparaître — il doit
   avertir. C'est la colonne `refundable_until` de §05.

4. **Résultats : webhook d'abord, cron en filet.** `POST /subscribe` existe et livre un
   `CandidateResultWebhook` complet, détails par thème inclus. C'est le mécanisme principal. Mais un
   webhook peut être manqué (indisponibilité, déploiement) : garder un cron qui interroge
   `GET /participations/{id}/results` pour les sessions passées depuis moins de 72 h et encore sans
   résultat. Le statut `DELAY` confirme l'attente de 24 h.

5. **NEPH invalide : détecté en amont, désormais.** `GET /candidates` étant une porte d'entrée, on
   n'attend plus le rejet d'une réservation. `valid: false` → `neph_status = 'invalide'`, tâche admin,
   et **aucun engagement financier**. C'est le gain le plus net apporté par le Swagger.

6. **Erreurs métier structurées.** Un `400` renvoie `{ message, details[] { fieldName, message,
   originalMessage, rejectedValue } }`. Ce tableau doit être remonté champ par champ dans le
   formulaire, et non aplati en un toast générique : c'est ce qui distingue « erreur d'inscription »
   de « le code postal est refusé ». À noter : ni `404`, ni `409`, ni `429` ne sont documentés — donc
   **aucune limite de débit connue**. Rester prudent sur la fréquence des crons malgré tout.

---

## 7. La frontière de l'automatisable

### Automatisable immédiatement, sans dépendance externe

- Le routeur d'entrée et la machine à états.
- La checklist documentaire ANTS — identité, justificatif de domicile, photo-signature numérique,
  JDC / ASSR selon l'âge — avec upload, validation admin et blocage tant que le dossier est incomplet.
- Les relances : pièce manquante, dossier déposé sans NEPH au-delà de ~10 jours, ETG approchant des
  5 ans, NEPH approchant des 6 ans d'inactivité.
- Le déblocage automatique de l'étape suivante à la saisie du NEPH.

### Automatisable via l'API (après obtention des deux clés)

Vérification du NEPH au ministère, création/mise à jour du compte candidat, recherche de centres et de
sessions, inscription en lot, paiement par redirection, annulation, convocation PDF, résultats par
thème, webhooks.

### À ne pas automatiser — décision d'architecture, pas limite technique

Piloter le portail ANTS par **scraping ou RPA** est à proscrire : contraire aux conditions
d'utilisation, structurellement fragile, et cela ferait transiter des **pièces d'identité** hors de
tout cadre contractuel de sous-traitance RGPD. Le risque n'est pas technique, il est juridique, et il
porte sur l'agrément de l'auto-école.

La création du NEPH reste un acte administratif de l'État. Ce qu'on automatise autour d'elle —
checklist, relances, suivi de délai, déblocage — élimine en pratique l'essentiel de la charge de
secrétariat.

### Conformité

- **RGPD.** NEPH, date de naissance, pièces justificatives : données personnelles. Minimisation (ne
  pas dupliquer le NEPH dans les logs), durée de conservation explicite, bucket Storage privé, RLS
  stricte, journalisation des accès admin. Bureau Veritas est **sous-traitant** au sens de l'article
  28 : l'annexe correspondante doit figurer au contrat partenaire. Le `PUT /candidates` transmet
  identité, email, téléphone et code postal — le consentement et l'information de l'élève doivent
  couvrir ce transfert.
- **Agrément.** Compte « Partner » *et* compte auto-école actif, avec numéro Aurige.
- **Tarif réglementé.** L'ETG est à 30 €, fixé par l'État. Le paiement passant par la page carte
  bancaire de Bureau Veritas, BeInDrive n'encaisse pas ce montant — à ne pas confondre avec ses
  propres frais de service dans la facturation.
- **Accessibilité.** `hasHandicapAccess` existe sur `Site` et sur `Session` : à exposer comme filtre
  de recherche, pas à ignorer.

---

## 8. Plan de mise en œuvre

| Lot | Contenu | Dépendance |
|---|---|---|
| **0** | Compte « Partner » (question.pro@codengo.fr) **+** compte auto-école sur le portail. Récupération des deux clés. Accès recette `codengo-ppd`. Déblocage réseau du domaine. | 🔴 Chemin critique — délais administratifs |
| **1** | Migration SQL + RLS, routeur d'entrée, écrans dossier et checklist, tests Vitest | 🟢 Aucune |
| **2** | Connecteur : `check-neph` → `upsert-candidate` → `sites` / `sessions` → `register-participations` + routes de rappel de paiement | 🔴 Lot 0 |
| **3** | Webhook de résultats, convocation PDF, réconciliation, purge des participations orphelines | 🔴 Lot 0 |
| **4** | Branche conduite : évaluation de départ, contrat de formation, livret d'apprentissage | 🟢 Aucune |
| **5** | Révision ciblée à partir de `result_details` (erreurs par thème) | 🔴 Lot 3 |

Les lots **1 et 4 sont réalisables dès aujourd'hui** : ils ne dépendent ni des clés ni du déblocage
réseau, et portent la majeure partie de la valeur métier. Le lot 0 étant administratif — deux
demandes distinctes, une clé envoyée par courrier — il doit être lancé **maintenant**, en parallèle
du lot 1, faute de quoi il deviendra le goulot d'étranglement du projet.

Le lot 5 est le plus différenciant : aucun concurrent n'exploite les résultats par thème pour orienter
la révision. C'est aussi le moins coûteux, une fois le lot 3 en place.

---

## 9. Ce qui reste à confirmer en recette

Le Swagger répond à la plupart des questions ouvertes de la révision 1. Il en reste six, toutes
vérifiables sur `codengo-ppd` dès que les clés sont disponibles.

1. **Corps exact de `POST /sessions/{id}/participations`** — comment `CandidateIdParticipationCategory[]`
   et `ParticipationRequest` se combinent dans la même requête.
2. **Paramètres de requête de `GET /candidates`** — NEPH seul, ou NEPH + nom + date de naissance ?
   Le ministère vérifie probablement la cohérence de l'ensemble.
3. **Filtres de `GET /sessions`** — site, période, capacité restante, accès PMR ? Détermine si le
   filtrage géographique se fait côté API ou côté BeInDrive après un `GET /sites`.
4. **Version d'API à figer** — la doc écrit `/api/v*/` ; le fichier s'appelle `swagger_v1.json`, donc
   `v1` selon toute vraisemblance.
5. **Sens réel de `A` / `B`** — lever l'incohérence de documentation signalée en §01bis par un appel
   réel, avant de câbler l'affichage des résultats.
6. **Configuration du webhook** — corps attendu par `POST /subscribe` (URL de rappel, secret de
   signature, types d'événements souscriptibles) et politique de réémission en cas d'échec.

---

## Sources

- API Code'nGo — `https://codengo.bureauveritas.fr/api/doc/swagger-api-internet/swagger_v1.json`
- Ouverture d'un compte partenaire — `question.pro@codengo.fr`
- [Bureau Veritas — Rejoindre Code'nGo! comme auto-école partenaire](https://www.bureauveritas.fr/besoin/rejoindre-codengo-en-tant-quauto-ecole-ou-centre-dexamen-partenaire)
- [Bureau Veritas — L'examen du code avec Code'nGo!](https://www.bureauveritas.fr/besoin/conduite-vers-la-reussite-lexamen-du-code-de-la-route-avec-codengo)
- [ANTS / France Titres — Espace auto-école](https://autoecole.ants.gouv.fr/)
- [ANTS — Inscrire un élève à l'examen du permis de conduire](https://autoecole.ants.gouv.fr/demarches-en-ligne/-inscrire-un-eleve-a-l-examen-du-permis-de-conduire)
- [LegiPermis — Numéro de permis et code NEPH](https://www.legipermis.com/legislation/numero-permis-de-conduire.html)
