import type { ApiCategory, LicenceCategory } from "./types";

/**
 * Contrôles de forme sur le NEPH.
 *
 * Principe : ces contrôles servent à intercepter une faute de frappe évidente,
 * jamais à trancher. Seule l'ANTS — ou le contrôle ministériel relayé par
 * `GET /candidates` de Code'nGo — fait autorité.
 *
 * Deux raisons de rester souple :
 *  - le NEPH français canonique compte 12 chiffres, mais le Swagger Code'nGo
 *    donne des exemples à 14 et 16 chiffres, et n'impose aucune longueur ;
 *  - le découpage AAMMDD des six premiers chiffres suppose un département sur
 *    deux caractères, ce qui exclut la Corse (2A/2B) et l'outre-mer (971–976).
 */

export const NEPH_MIN_LENGTH = 10;
export const NEPH_MAX_LENGTH = 18;

/** Longueur du NEPH français le plus courant. Indicative, pas normative. */
export const NEPH_CANONICAL_LENGTH = 12;

export type NephFormatSeverity = "ok" | "warning" | "error";

export interface NephFormatResult {
  severity: NephFormatSeverity;
  /** Valeur nettoyée à enregistrer, ou null si inexploitable. */
  normalized: string | null;
  message?: string;
}

/** Retire espaces, points et tirets — les élèves recopient le numéro tel qu'affiché. */
export function normalizeNeph(raw: string): string {
  return raw.replace(/[\s.\-/]/g, "");
}

export function checkNephFormat(raw: string | null | undefined): NephFormatResult {
  if (!raw || raw.trim() === "") {
    return { severity: "error", normalized: null, message: "Numéro NEPH absent." };
  }

  const normalized = normalizeNeph(raw);

  if (!/^\d+$/.test(normalized)) {
    return {
      severity: "error",
      normalized: null,
      message: "Le NEPH ne contient que des chiffres.",
    };
  }

  if (normalized.length < NEPH_MIN_LENGTH || normalized.length > NEPH_MAX_LENGTH) {
    return {
      severity: "error",
      normalized: null,
      message: `Le NEPH compte entre ${NEPH_MIN_LENGTH} et ${NEPH_MAX_LENGTH} chiffres.`,
    };
  }

  // Au-delà, on n'échoue plus : on avertit. Un numéro hors gabarit habituel peut
  // être parfaitement valide, et c'est le ministère qui tranchera.
  if (normalized.length !== NEPH_CANONICAL_LENGTH) {
    return {
      severity: "warning",
      normalized,
      message:
        `Longueur inhabituelle (${normalized.length} chiffres au lieu de ` +
        `${NEPH_CANONICAL_LENGTH}). Vérifiez la saisie — le numéro sera contrôlé.`,
    };
  }

  const month = Number(normalized.slice(2, 4));
  if (month < 1 || month > 12) {
    return {
      severity: "warning",
      normalized,
      message:
        "Les chiffres 3 et 4 ne correspondent pas à un mois valide. " +
        "Vérifiez la saisie — certains numéros dérogent à ce découpage.",
    };
  }

  return { severity: "ok", normalized };
}

/**
 * Traduit la catégorie interne vers celle attendue par l'API Code'nGo.
 *
 * ⚠️ La documentation Code'nGo se contredit : `Participation` et
 * `CandidateIdParticipationCategory` donnent A = moto / B = voiture, tandis que
 * `ParticipationResults` annonce l'inverse. Deux occurrences contre une, et
 * l'usage français, retiennent A = moto. À confirmer en recette avant
 * d'exploiter l'affichage des résultats.
 *
 * B78 (boîte automatique) et AAC (conduite accompagnée) passent la même épreuve
 * théorique que B : ils sont donc mappés sur B.
 */
export function toApiCategory(category: LicenceCategory): ApiCategory {
  switch (category) {
    case "A":
    case "A1":
    case "A2":
      return "A";
    case "B":
    case "B78":
    case "AAC":
    case "BE":
      return "B";
  }
}

/** L'ETG est valable 5 ans à compter de son obtention. */
export const ETG_VALIDITY_YEARS = 5;

/** Un NEPH sans activité se désactive au bout de 6 ans. */
export const NEPH_DORMANCY_YEARS = 6;

/** Délai constaté d'attribution du NEPH, au-delà duquel on relance. */
export const NEPH_EXPECTED_DELAY_DAYS = 12;

function addYears(date: Date, years: number): Date {
  const next = new Date(date.getTime());
  next.setFullYear(next.getFullYear() + years);
  return next;
}

export function etgExpiresOn(obtainedAt: Date): Date {
  return addYears(obtainedAt, ETG_VALIDITY_YEARS);
}

export function isEtgValid(obtainedAt: Date | null, now: Date): boolean {
  if (!obtainedAt) return false;
  return etgExpiresOn(obtainedAt).getTime() > now.getTime();
}

export function isNephDormant(grantedAt: Date | null, now: Date): boolean {
  if (!grantedAt) return false;
  return addYears(grantedAt, NEPH_DORMANCY_YEARS).getTime() <= now.getTime();
}

export function daysSince(date: Date, now: Date): number {
  return Math.floor((now.getTime() - date.getTime()) / 86_400_000);
}
