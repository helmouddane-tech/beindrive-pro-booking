# Dossier de demande d'accès aux canaux d'intégration éditeur

**Trois demandes parallèles : France Titres (API-ANTS) · DSR (API Livret Numérique) · Bureau Veritas (Code'nGo)**

Document de travail interne + courriers prêts à envoyer.
Analyse technique associée : [`automatisation-neph-code-permis-b.md`](./automatisation-neph-code-permis-b.md).

---

## 0. Avant d'envoyer : ce qu'il faut avoir sous la main

Ces demandes sont **instruites**, pas enregistrées. Un dossier incomplet revient, et le délai repart.
Rassembler d'abord :

| Élément | Pourquoi il est demandé | Statut |
|---|---|---|
| N° d'agrément préfectoral d'enseignement (`E-XX-XXX-XXXX`) | Prouve la qualité d'auto-école | ⬜ À compléter |
| N° **Aurige** de l'établissement | Identifiant métier utilisé par l'administration et par Code'nGo | ⬜ À compléter |
| SIREN / SIRET, raison sociale, adresse du siège | Identification de la personne morale | ⬜ À compléter |
| Nom et qualité du représentant légal | Signataire de la convention | ⬜ À compléter |
| Contact technique (nom, courriel, téléphone) | Interlocuteur pour l'habilitation | ⬜ À compléter |
| **Adresse IP publique fixe de sortie** | Déclaration obligatoire si liste blanche (§2) | ⬜ **À provisionner** — voir §4 |
| Volumétrie annuelle d'élèves, actuelle et projetée | Dimensionnement et priorisation par l'administration | ⬜ À compléter |
| Rattachement RdvPermis de l'établissement | Prérequis de l'API Livret Numérique | ⬜ À vérifier |

> ⚠️ **L'adresse IP fixe est le seul point qui demande un vrai travail technique en amont.** Elle doit
> être déclarée dans la demande, donc décidée avant l'envoi. Voir §4.

---

## 1. Établi vs à confirmer — la base factuelle de la demande

Ne pas affirmer dans un courrier officiel ce qui n'est pas sourcé. Répartition :

### Établi par des sources officielles

- Depuis 2017, les auto-écoles déposent les demandes de permis de leurs élèves en ligne **via un web
  service fourni par l'ANTS**.
- « Les principaux acteurs ont la possibilité d'**adhérer à l'API-ANTS** s'ils le souhaitent, la
  démarche restant **volontaire**. »
- Certaines plateformes n'y ont pas accès malgré des volumes importants — donc l'accès est
  **discrétionnaire**.
- Sources : réponses ministérielles aux questions écrites n° 3831, 6701 et 11214 (Assemblée nationale,
  15ᵉ législature).
- L'**API Livret Numérique** relève du dispositif **RdvPermis** piloté par la **DSR**, transmet les
  heures de formation, alimente le calcul des **ETP** exécuté entre le 24 et le 25 de chaque mois, et
  ces ETP **déterminent l'attribution des places d'examen**.

### Corroboré par des sources éditeurs, non par l'administration

- **AGX Informatique** : « passerelle ANTS » intégrée, transfert des informations élève « en un clic,
  sans ressaisie ».
- **AutoSoft** : API officielle ANTS avec **code éditeur**, **IP autorisée**, **certificat dédié**,
  échanges **SOAP**, préremplissage et suivi de statut en temps réel.
- **Easysystème / Codes Rousseau** : remontée quotidienne automatique des heures vers la DSR dès
  rattachement à un compte RdvPermis.

### Non public — objet même de la demande

WSDL, endpoints, schémas de messages, mécanisme d'authentification exact, environnement de recette,
procédure et critères d'habilitation.

> **Sur la tentation de chercher le WSDL en amont.** Inutile : sur un système d'État protégé par
> certificat client et liste blanche d'IP, l'URL n'est pas le verrou — les identifiants le sont. La
> documentation est remise **avec** l'habilitation. La demande formelle est la seule voie, et c'est
> aussi la plus rapide.

---

## 2. Les questions à poser — API-ANTS (France Titres)

Formulées pour obtenir des réponses exploitables, pas un accusé de réception.

**Sur l'existence et l'éligibilité**
1. Un programme éditeur / partenaire existe-t-il pour le domaine « permis de conduire » (dépôt de
   demandes, suivi, restitution du NEPH) ?
2. Quels sont les **critères d'éligibilité** ? Une auto-école développant son propre système
   d'information pour son seul usage peut-elle être habilitée, ou l'agrément est-il réservé aux
   éditeurs commercialisant une solution auprès de tiers ?
3. Quelle est la **procédure et le délai** d'instruction ? Existe-t-il une convention type
   communicable en amont ?

**Sur la technique**
4. Nature de l'interface : **SOAP** (WSDL communicable ?) ou REST ? Quelles versions sont maintenues ?
5. Mécanisme d'authentification : **certificat client** (quelle autorité de certification ? quel
   format ? quelle durée ?), **code éditeur**, **liste blanche d'IP** ? Combien d'adresses IP peuvent
   être déclarées, et selon quelle procédure les modifier ensuite ?
6. Existe-t-il un **environnement de recette** avec jeu de données de test, accessible avant la mise
   en production ?
7. Périmètre exact des opérations exposées : création de demande, préremplissage, transmission des
   pièces justificatives, consultation de statut, **restitution du NEPH attribué**, notification de
   changement d'état (webhook / interrogation ?).
8. Contraintes d'exploitation : quotas, limitation de débit, plages de maintenance, SLA, procédure de
   montée de version.

**Sur la conformité**
9. Quelles obligations pèsent sur l'habilité en matière de sécurité, de conservation et de traçabilité
   des données ? Un homologation ou audit préalable est-il exigé ?
10. Quelle qualification RGPD retenez-vous pour l'habilité (sous-traitant, responsable conjoint) et
    quelle documentation contractuelle l'accompagne ?

---

## 3. Les questions à poser — API Livret Numérique (DSR / RdvPermis)

Demande distincte, autorité distincte, et **retour sur investissement le plus immédiat des trois**.

1. Quelle est la procédure pour qu'un établissement rattaché à RdvPermis transmette lui-même ses
   données de livret numérique par API, sans passer par un éditeur tiers ?
2. Documentation technique de l'API : format, authentification, fréquence de remontée attendue,
   granularité (par leçon, par jour), gestion des corrections rétroactives.
3. Règles de prise en compte pour le calcul des **ETP** : quelles heures sont comptabilisées, quelle
   date de coupure avant le calcul du 24-25, et comment vérifier ce qui a été retenu ?
4. Existe-t-il un environnement de test et un moyen de contrôler la conformité des données transmises
   avant qu'elles ne comptent pour les ETP ?
5. Conséquences documentées d'une absence ou d'une interruption de remontée sur l'attribution des
   places.

---

## 4. Le point d'architecture à décider avant d'envoyer

Un canal SOAP avec **certificat client et IP autorisée** ne peut pas être servi par une Edge Function
Supabase : son IP de sortie n'est ni fixe ni maîtrisée, et le magasin de certificats client n'y est pas
gérable proprement. Il faut donc un **hôte à IP statique** — c'est le seul écart d'infrastructure de
tout le projet, et l'IP doit figurer dans la demande.

| Option | IP fixe | Certificat client | Coût | Remarque |
|---|---|---|---|---|
| **VPS dédié** (petite instance) + proxy sortant | ✅ | ✅ | ~5–10 €/mois | Le plus simple à faire accepter ; une seule IP à déclarer |
| Passerelle NAT d'un fournisseur cloud | ✅ | ✅ | Variable | Pertinent seulement si l'infra y est déjà |
| Edge Function seule | ❌ | ❌ | — | **Écarté** — incompatible avec une liste blanche |

**Recommandation : le VPS dédié.** Il porte le seul connecteur ANTS, expose une API interne à
Supabase, ne détient aucune donnée de manière persistante, et concentre la surface sensible
(certificat, IP déclarée) sur une machine unique et auditable. Réserver l'IP **avant** l'envoi du
dossier, pour ne pas avoir à la faire modifier ensuite.

Les deux autres canaux ne posent pas ce problème : Code'nGo et, sauf indication contraire, le Livret
Numérique s'authentifient par clé ou jeton et restent servis par des Edge Functions.

---

## 5. Courrier 1 — France Titres (API-ANTS)

> **Destinataire à confirmer** via le formulaire de contact professionnel
> `autoecole.ants.gouv.fr/aide-et-contact`, en demandant explicitement le service en charge des
> **partenariats éditeurs / habilitations techniques**. Ne pas envoyer à une adresse générique de
> support usager : la demande n'y sera pas orientée. *(Aucune adresse n'est reproduite ici : elle doit
> être relevée sur le formulaire officiel au moment de l'envoi.)*

---

**Objet : Demande d'information et d'habilitation — accès éditeur à l'API-ANTS « permis de conduire »**

Madame, Monsieur,

Nous exploitons l'établissement d'enseignement de la conduite **[RAISON SOCIALE]**, titulaire de
l'agrément préfectoral **[E-XX-XXX-XXXX]**, numéro Aurige **[AURIGE]**, et développons en interne le
système d'information assurant la gestion de nos élèves — dossiers administratifs, planification,
livret d'apprentissage et suivi de formation.

Nous accompagnons aujourd'hui **[N]** élèves par an, dont l'essentiel en catégorie B.

Dans ce cadre, nous souhaitons **automatiser le dépôt des demandes de permis de conduire de nos
élèves** et la restitution du NEPH correspondant, afin de supprimer la double saisie entre notre
système et le portail professionnel, et de réduire les erreurs de constitution de dossier.

Nous comprenons des réponses ministérielles aux questions écrites n° 3831, 6701 et 11214 (Assemblée
nationale, 15ᵉ législature) qu'un web service — désigné « API-ANTS » — permet aux professionnels de
déposer ces demandes, et que l'adhésion des acteurs y est possible sur une base volontaire. Nous
souhaiterions savoir à quelles conditions nous pourrions y accéder.

Nous vous serions reconnaissants de nous préciser :

1. si un programme éditeur ou partenaire existe pour ce périmètre, et quels sont ses critères
   d'éligibilité — notamment si une auto-école développant son propre système d'information pour son
   seul usage peut être habilitée ;
2. la procédure d'habilitation, les pièces à fournir, le délai d'instruction, et s'il existe une
   convention type communicable en amont ;
3. la documentation technique de l'interface (WSDL ou spécification équivalente, schémas de messages)
   ainsi que le périmètre des opérations exposées, en particulier la restitution du NEPH attribué ;
4. les modalités techniques d'habilitation : certificat client (autorité, format, durée), code
   éditeur, déclaration d'adresses IP autorisées et procédure de modification ultérieure ;
5. l'existence d'un environnement de recette permettant de valider notre intégration avant toute mise
   en production ;
6. les obligations de sécurité, de traçabilité et de conservation qui pèseraient sur nous en tant
   qu'habilité, ainsi que la qualification RGPD retenue et la documentation contractuelle associée.

Nous sommes en mesure de déclarer une **adresse IP publique fixe** dédiée à ces échanges et de mettre
en œuvre l'authentification par certificat client. Notre contact technique est **[NOM, COURRIEL,
TÉLÉPHONE]**, à votre disposition pour tout échange préalable.

Si notre demande ne relève pas de votre service, nous vous serions reconnaissants de bien vouloir la
transmettre à l'entité compétente ou de nous en indiquer les coordonnées.

Nous vous remercions par avance de votre réponse et vous prions d'agréer, Madame, Monsieur,
l'expression de nos salutations distinguées.

**[NOM, QUALITÉ DU REPRÉSENTANT LÉGAL]**
[RAISON SOCIALE] — SIRET [SIRET]
[ADRESSE] · [TÉLÉPHONE] · [COURRIEL]

---

## 6. Courrier 2 — DSR / RdvPermis (API Livret Numérique)

> **Destinataire à confirmer.** Passer d'abord par le canal de support RdvPermis attaché à votre
> compte établissement, en demandant l'orientation vers le service de la **Direction de la sécurité
> routière** en charge du livret numérique et des interfaces techniques.

---

**Objet : Demande d'accès à l'API Livret Numérique — transmission directe par l'établissement**

Madame, Monsieur,

Nous exploitons l'établissement **[RAISON SOCIALE]**, agrément **[E-XX-XXX-XXXX]**, numéro Aurige
**[AURIGE]**, rattaché au compte RdvPermis **[RÉFÉRENCE]**.

Nous développons en interne notre outil de gestion pédagogique, dans lequel sont saisies les heures de
formation de nos élèves. Nous souhaitons **transmettre ces données directement par API** au dispositif
du livret numérique, afin qu'elles soient prises en compte dans le calcul de nos ETP sans ressaisie ni
recours à un éditeur tiers.

Nous vous serions reconnaissants de nous préciser :

1. la procédure permettant à un établissement de transmettre lui-même ses données de livret numérique
   par API, ainsi que les conditions d'éligibilité ;
2. la documentation technique de l'interface : format, authentification, fréquence de remontée
   attendue, granularité des données et traitement des corrections rétroactives ;
3. les règles de prise en compte pour le calcul des ETP — heures comptabilisées, date de coupure avant
   le calcul mensuel, et moyen de vérifier ce qui a effectivement été retenu ;
4. l'existence d'un environnement de test permettant de valider la conformité de nos transmissions
   avant qu'elles ne soient prises en compte ;
5. les conséquences d'une interruption de transmission sur l'attribution des places d'examen, et la
   procédure de rattrapage le cas échéant.

Notre contact technique est **[NOM, COURRIEL, TÉLÉPHONE]**.

Nous vous remercions par avance et vous prions d'agréer, Madame, Monsieur, l'expression de nos
salutations distinguées.

**[NOM, QUALITÉ DU REPRÉSENTANT LÉGAL]**
[RAISON SOCIALE] — SIRET [SIRET]

---

## 7. Courrier 3 — Bureau Veritas (compte Partner Code'nGo)

> **Destinataire connu et documenté** dans le Swagger de l'API : **question.pro@codengo.fr**.
> C'est la demande la plus simple des trois, et la seule dont le contrat technique est déjà en notre
> possession — donc à envoyer en premier.

---

**Objet : Demande d'ouverture d'un compte « Partner » — API Code'nGo**

Madame, Monsieur,

Nous exploitons l'établissement d'enseignement de la conduite **[RAISON SOCIALE]**, agrément
**[E-XX-XXX-XXXX]**, numéro Aurige **[AURIGE]**, et développons en interne le système d'information de
gestion de nos élèves.

Nous souhaitons intégrer l'API Code'nGo afin d'inscrire nos candidats aux sessions d'examen du code
depuis notre propre outil, et demandons à ce titre **l'ouverture d'un compte « Partner »** ainsi que la
délivrance de la clé d'authentification `X-Auth-Partner-key`.

Nous vous serions reconnaissants de nous préciser :

1. les pièces et informations nécessaires à l'ouverture du compte Partner, ainsi que le délai
   d'instruction ;
2. les modalités d'accès à l'environnement de **pré-production** (`codengo-ppd`), afin de développer
   et recetter notre intégration sans engager de réservation réelle ;
3. la composition exacte du corps de la requête `POST /sessions/{id}/participations`, la
   documentation ne précisant pas comment y sont combinés les objets
   `CandidateIdParticipationCategory` et `ParticipationRequest` ;
4. les paramètres de requête attendus par `GET /candidates` pour le contrôle de validité auprès du
   ministère de l'Intérieur ;
5. les modalités de souscription aux webhooks (`POST /subscribe`) : corps attendu, secret de
   signature, types d'événements et politique de réémission ;
6. le sens retenu pour les catégories `A` et `B`, la documentation étant contradictoire entre les
   modèles `Participation` et `ParticipationResults` ;
7. les modalités de facturation des sessions et l'existence éventuelle de quotas ou de limitations de
   débit sur l'API.

Nous disposons par ailleurs d'un compte auto-école sur le portail Code'nGo **[ou : nous en engageons la
création en parallèle]**, dont nous récupérerons la clé `X-Auth-Driving-School-key`.

Notre contact technique est **[NOM, COURRIEL, TÉLÉPHONE]**.

Nous vous remercions par avance et vous prions d'agréer, Madame, Monsieur, l'expression de nos
salutations distinguées.

**[NOM, QUALITÉ DU REPRÉSENTANT LÉGAL]**
[RAISON SOCIALE] — SIRET [SIRET]

---

## 8. Suivi des demandes

| # | Canal | Destinataire | Envoyé le | Relance | Réponse | Issue |
|---|---|---|---|---|---|---|
| 1 | Code'nGo (Partner) | question.pro@codengo.fr | ⬜ | J+15 | ⬜ | ⬜ |
| 2 | Code'nGo (auto-école) | portail | ⬜ | — | ⬜ | ⬜ |
| 3 | API-ANTS | France Titres — service éditeurs | ⬜ | J+30 | ⬜ | ⬜ |
| 4 | API Livret Numérique | DSR / RdvPermis | ⬜ | J+30 | ⬜ | ⬜ |

**Ordre d'envoi recommandé** — les trois partent la même semaine, mais dans cet ordre de priorité :

1. **Code'nGo** en premier : destinataire connu, contrat technique déjà en main, délai court, et c'est
   le canal qui débloque la fonctionnalité la plus visible pour l'élève.
2. **API Livret Numérique** ensuite : retour sur investissement le plus direct — des places d'examen
   supplémentaires — et probablement moins sélectif qu'un agrément éditeur.
3. **API-ANTS** en parallèle : le plus incertain et le plus long, donc celui qu'il faut lancer tôt
   même si l'issue est douteuse. Une réponse négative reste une information utile — elle ferme
   définitivement la question et valide la stratégie de repli du §07.

**Stratégie de repli, à assumer dès maintenant.** Si l'habilitation API-ANTS est refusée, le parcours
reste entièrement fonctionnel : le dépôt se fait au portail professionnel et le NEPH est saisi
manuellement dans BeInDrive, ce qui déclenche automatiquement la suite. Le produit ne dépend pas de
cette habilitation — elle le distingue. C'est précisément pour cela qu'il ne faut pas conditionner la
feuille de route à sa réponse.

---

## Sources

- Réponses ministérielles, questions écrites n° [3831](https://questions.assemblee-nationale.fr/q15/15-3831QE.htm), [6701](https://questions.assemblee-nationale.fr/q15/15-6701QE.htm) et [11214](https://2017-2022.nosdeputes.fr/15/question/QE/11214) — Assemblée nationale, 15ᵉ législature
- [France Titres (ANTS) — Espace auto-école](https://autoecole.ants.gouv.fr/) · [Aide & contact](https://autoecole.ants.gouv.fr/aide-et-contact)
- [France Titres — Créer la demande de permis d'un élève](https://autoecole.ants.gouv.fr/tout-savoir/creer-la-demande-de-permis-dun-eleve)
- [AGX Informatique — passerelle ANTS](https://agx.fr/ANTS)
- [AutoSoft — logiciel de gestion d'auto-école](https://www.auto-soft.fr/)
- [Codes Rousseau — API Livret Numérique et calcul des ETP](https://pro.codesrousseau.fr/le-mag-pro/09/1127-api-livret-numerique-et-calcul-des-etp.html)
- [Tribune des auto-écoles — espace API Livret Numérique sur Easysystème](https://www.tribune-auto-ecoles.fr/mobile/pages/nouveautes/fiche.php?id=1528)
- API Code'nGo — `https://codengo.bureauveritas.fr/api/doc/swagger-api-internet/swagger_v1.json`
