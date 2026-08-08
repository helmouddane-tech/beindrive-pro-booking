/**
 * Types du domaine « parcours élève ».
 *
 * Miroir exact des énumérations SQL de
 * supabase/migrations/20260808094500_erp_multi_tenant_neph_code.sql.
 * Toute valeur ajoutée ici doit l'être aussi côté base, et réciproquement.
 */

export type IntegrationMode = "manuel" | "assiste" | "automatise";

export type RecordSource = "api" | "manual" | "import";

export type TenantRole = "school_admin" | "instructor" | "student";

export type LicenceCategory = "B" | "B78" | "AAC" | "A1" | "A2" | "A" | "BE";

/** Les deux seules catégories connues de l'API Code'nGo. */
export type ApiCategory = "A" | "B";

export type NephStatus =
  | "absent"
  | "en_demande"
  | "declare"
  | "verifie_ministere"
  | "invalide"
  | "inactif";

export type EnrollmentStatus =
  | "prospect"
  | "dossier_a_constituer"
  | "dossier_depose_ants"
  | "neph_a_verifier"
  | "neph_attribue"
  | "neph_invalide"
  | "neph_inactif"
  | "code_a_planifier"
  | "code_reserve"
  | "code_obtenu"
  | "formation_conduite"
  | "pret_examen_pratique"
  | "permis_obtenu"
  | "abandonne";

/**
 * L'action unique mise en avant à l'écran.
 *
 * Le principe produit : jamais « voici six choses à faire », toujours « voici la
 * prochaine ». C'est ce qui remplace le secrétariat.
 */
export type NextAction =
  | { kind: "collect_documents" }
  | { kind: "submit_ants_application"; mode: IntegrationMode }
  | { kind: "await_neph"; requestedOn: Date | null; overdue: boolean }
  | { kind: "verify_neph" }
  | { kind: "fix_neph" }
  | { kind: "reactivate_neph" }
  | { kind: "book_code_exam"; mode: IntegrationMode }
  | { kind: "await_code_result" }
  | { kind: "start_driving" }
  | { kind: "none" };

export interface EnrollmentSnapshot {
  neph: string | null;
  nephStatus: NephStatus;
  /** Date de dépôt du dossier ANTS, pour le suivi de délai. */
  nephRequestedAt: Date | null;
  /** Date d'attribution, référence de la péremption à 6 ans d'inactivité. */
  nephGrantedAt: Date | null;
  etgObtainedAt: Date | null;
  category: LicenceCategory;
  /** Mode Code'nGo de l'établissement : décide si le NEPH peut être vérifié. */
  codengoMode: IntegrationMode;
  antsMode: IntegrationMode;
  /** Une inscription au code est en cours (participation non terminée). */
  hasActiveCodeRegistration: boolean;
  /** Toutes les pièces du dossier ANTS sont validées. */
  documentsComplete: boolean;
}

export interface RoutingDecision {
  status: EnrollmentStatus;
  nextAction: NextAction;
  /** Pourquoi cette décision — destiné à l'affichage, pas au débogage. */
  reasons: string[];
  /** Ce que l'élève ou le secrétariat doit savoir sans que ça bloque. */
  warnings: string[];
}
