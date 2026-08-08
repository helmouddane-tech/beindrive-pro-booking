import {
  NEPH_EXPECTED_DELAY_DAYS,
  daysSince,
  isEtgValid,
  isNephDormant,
} from "./neph";
import type {
  EnrollmentSnapshot,
  EnrollmentStatus,
  RecordSource,
  RoutingDecision,
} from "./types";

/**
 * Routeur du parcours élève.
 *
 * Fonction pure, sans aucune I/O : c'est ce qui la rend testable et ce qui
 * garantit qu'elle produit la même décision côté client, côté Edge Function et
 * côté job de synchronisation.
 *
 * La bifurcation centrale répond à la question métier : l'élève a-t-il déjà un
 * numéro, et si oui faut-il le positionner sur le code ou démarrer sa conduite ?
 */
export function routeEnrollment(
  snapshot: EnrollmentSnapshot,
  now: Date = new Date(),
): RoutingDecision {
  const reasons: string[] = [];
  const warnings: string[] = [];

  // --- Impasses administratives : elles priment sur tout le reste -----------

  if (snapshot.nephStatus === "invalide") {
    return {
      status: "neph_invalide",
      nextAction: { kind: "fix_neph" },
      reasons: ["Le numéro NEPH a été rejeté par le ministère de l'Intérieur."],
      warnings: ["Aucune inscription à l'examen n'est possible en l'état."],
    };
  }

  if (snapshot.nephStatus === "inactif") {
    return {
      status: "neph_inactif",
      nextAction: { kind: "reactivate_neph" },
      reasons: [`Le NEPH est dormant depuis plus de 6 ans.`],
      warnings: ["Une réactivation doit être demandée à l'ANTS."],
    };
  }

  // --- Branche « pas de numéro » : constitution puis dépôt du dossier -------

  // Traité avant le cas « absent » : un dossier déposé à l'ANTS n'a, par
  // définition, pas encore de numéro. Tester `!neph` en premier rendrait cet
  // état inatteignable et renverrait l'élève au dépôt qu'il vient de faire.
  if (snapshot.nephStatus === "en_demande") {
    const requestedOn = snapshot.nephRequestedAt;
    const overdue =
      requestedOn !== null && daysSince(requestedOn, now) > NEPH_EXPECTED_DELAY_DAYS;

    if (overdue) {
      warnings.push(
        `Dossier déposé depuis plus de ${NEPH_EXPECTED_DELAY_DAYS} jours ` +
          "sans NEPH : relancer l'ANTS.",
      );
    }

    return {
      status: "dossier_depose_ants",
      nextAction: { kind: "await_neph", requestedOn, overdue },
      reasons: ["Dossier déposé, en attente d'attribution du numéro."],
      warnings,
    };
  }

  if (snapshot.nephStatus === "absent" || !snapshot.neph) {
    if (!snapshot.documentsComplete) {
      return {
        status: "dossier_a_constituer",
        nextAction: { kind: "collect_documents" },
        reasons: ["Aucun NEPH connu : le dossier ANTS doit être constitué."],
        warnings,
      };
    }
    return {
      status: "dossier_a_constituer",
      nextAction: { kind: "submit_ants_application", mode: snapshot.antsMode },
      reasons: ["Le dossier est complet et peut être déposé à l'ANTS."],
      warnings,
    };
  }

  // --- Le numéro existe : reste à savoir s'il est vérifié -------------------

  // Un NEPH attribué de longue date et resté sans usage est probablement
  // dormant, même si le statut n'a pas encore été mis à jour.
  if (isNephDormant(snapshot.nephGrantedAt, now)) {
    return {
      status: "neph_inactif",
      nextAction: { kind: "reactivate_neph" },
      reasons: ["Le NEPH a été attribué il y a plus de 6 ans sans activité."],
      warnings: ["À confirmer auprès de l'ANTS avant toute inscription."],
    };
  }

  const verified = snapshot.nephStatus === "verifie_ministere";

  if (!verified) {
    // En mode automatisé, la vérification ministérielle est disponible et
    // obligatoire : elle évite d'engager 30 € sur un numéro erroné.
    if (snapshot.codengoMode === "automatise") {
      return {
        status: "neph_a_verifier",
        nextAction: { kind: "verify_neph" },
        reasons: ["Le NEPH doit être vérifié auprès du ministère avant réservation."],
        warnings,
      };
    }

    // En mode manuel ou assisté, cet appel n'existe pas. Le parcours continue,
    // mais l'absence de garantie doit rester visible — ne jamais laisser croire
    // à une vérification qui n'a pas eu lieu.
    warnings.push(
      "NEPH non vérifié auprès du ministère : saisie déclarative sous la " +
        "responsabilité de l'établissement.",
    );
  }

  // --- Bifurcation : code ou conduite ? ------------------------------------

  if (isEtgValid(snapshot.etgObtainedAt, now)) {
    reasons.push("Code obtenu et encore valide : la formation à la conduite peut démarrer.");
    return {
      status: "formation_conduite",
      nextAction: { kind: "start_driving" },
      reasons,
      warnings,
    };
  }

  if (snapshot.etgObtainedAt) {
    warnings.push("Le code obtenu a plus de 5 ans : il doit être repassé.");
  }

  if (snapshot.hasActiveCodeRegistration) {
    reasons.push("Une inscription à l'examen du code est en cours.");
    return {
      status: "code_reserve",
      nextAction: { kind: "await_code_result" },
      reasons,
      warnings,
    };
  }

  reasons.push("NEPH disponible, code à passer : l'élève peut être positionné sur une session.");
  return {
    status: "code_a_planifier",
    nextAction: { kind: "book_code_exam", mode: snapshot.codengoMode },
    reasons,
    warnings,
  };
}

// ---------------------------------------------------------------------------
// Réservation de l'examen du code : le verrou d'entrée
// ---------------------------------------------------------------------------

export interface BookingGate {
  allowed: boolean;
  /** L'admin doit confirmer explicitement qu'il assume le NEPH non vérifié. */
  requiresAdminConfirmation: boolean;
  reason: string;
}

/**
 * Décide si un élève peut être inscrit à une session d'examen du code.
 *
 * En mode automatisé, la vérification ministérielle est un prérequis dur : une
 * place coûte 30 € et le rejet d'un NEPH est irrattrapable une fois payée.
 * En mode manuel, cet appel n'existe pas — la responsabilité se déplace sur
 * l'établissement, mais elle doit être assumée explicitement.
 */
export function canBookCodeExam(snapshot: EnrollmentSnapshot): BookingGate {
  if (!snapshot.neph || snapshot.nephStatus === "absent" || snapshot.nephStatus === "en_demande") {
    return {
      allowed: false,
      requiresAdminConfirmation: false,
      reason: "Aucun NEPH attribué : l'inscription à l'examen est impossible.",
    };
  }

  if (snapshot.nephStatus === "invalide") {
    return {
      allowed: false,
      requiresAdminConfirmation: false,
      reason: "NEPH rejeté par le ministère.",
    };
  }

  if (snapshot.nephStatus === "inactif") {
    return {
      allowed: false,
      requiresAdminConfirmation: false,
      reason: "NEPH dormant : réactivation ANTS requise.",
    };
  }

  if (snapshot.nephStatus === "verifie_ministere") {
    return {
      allowed: true,
      requiresAdminConfirmation: false,
      reason: "NEPH vérifié auprès du ministère.",
    };
  }

  // nephStatus === 'declare'
  if (snapshot.codengoMode === "automatise") {
    return {
      allowed: false,
      requiresAdminConfirmation: false,
      reason:
        "Le NEPH doit d'abord être vérifié auprès du ministère " +
        "(la vérification est disponible dans ce mode).",
    };
  }

  return {
    allowed: true,
    requiresAdminConfirmation: true,
    reason:
      "NEPH déclaré mais non vérifié : la vérification ministérielle n'est pas " +
      "disponible en mode manuel. L'établissement en assume la responsabilité.",
  };
}

// ---------------------------------------------------------------------------
// Transitions forcées par un humain
// ---------------------------------------------------------------------------

/**
 * Transitions manuelles autorisées.
 *
 * L'ERP doit rester pilotable à la main : un élève arrive d'une autre
 * auto-école avec son code, un dossier a été déposé hors ERP, un résultat
 * arrive par courrier avant tout webhook. Mais la liberté est bornée — sans
 * cela la machine à états ne veut plus rien dire, et les statuts ne sont plus
 * exploitables pour piloter quoi que ce soit.
 */
const ALLOWED_MANUAL_TRANSITIONS: Record<EnrollmentStatus, EnrollmentStatus[]> = {
  prospect: ["dossier_a_constituer", "neph_attribue", "code_a_planifier", "abandonne"],
  dossier_a_constituer: ["dossier_depose_ants", "neph_attribue", "abandonne"],
  dossier_depose_ants: ["neph_attribue", "dossier_a_constituer", "abandonne"],
  neph_a_verifier: ["neph_attribue", "neph_invalide", "code_a_planifier", "abandonne"],
  neph_attribue: ["code_a_planifier", "formation_conduite", "neph_inactif", "abandonne"],
  neph_invalide: ["dossier_a_constituer", "neph_a_verifier", "abandonne"],
  neph_inactif: ["dossier_a_constituer", "neph_attribue", "abandonne"],
  code_a_planifier: ["code_reserve", "code_obtenu", "abandonne"],
  code_reserve: ["code_obtenu", "code_a_planifier", "abandonne"],
  code_obtenu: ["formation_conduite", "code_a_planifier", "abandonne"],
  formation_conduite: ["pret_examen_pratique", "code_a_planifier", "abandonne"],
  pret_examen_pratique: ["permis_obtenu", "formation_conduite", "abandonne"],
  permis_obtenu: [],
  abandonne: ["prospect", "dossier_a_constituer", "formation_conduite"],
};

export interface TransitionRequest {
  from: EnrollmentStatus;
  to: EnrollmentStatus;
  source: RecordSource;
  reason?: string;
}

export interface TransitionResult {
  allowed: boolean;
  error?: string;
}

export function canForceTransition(request: TransitionRequest): TransitionResult {
  const { from, to, source, reason } = request;

  if (from === to) {
    return { allowed: false, error: "L'élève est déjà dans cet état." };
  }

  if (source === "manual" && (!reason || reason.trim() === "")) {
    return {
      allowed: false,
      error: "Une transition manuelle exige un motif — il est journalisé.",
    };
  }

  const permitted = ALLOWED_MANUAL_TRANSITIONS[from] ?? [];
  if (!permitted.includes(to)) {
    return {
      allowed: false,
      error: `Transition « ${from} » → « ${to} » non autorisée.`,
    };
  }

  return { allowed: true };
}

/** Les transitions ouvertes depuis un état donné, pour alimenter un menu. */
export function allowedTransitionsFrom(status: EnrollmentStatus): EnrollmentStatus[] {
  return ALLOWED_MANUAL_TRANSITIONS[status] ?? [];
}
