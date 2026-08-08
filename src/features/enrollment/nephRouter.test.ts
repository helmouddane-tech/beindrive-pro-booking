import { describe, it, expect } from "vitest";
import {
  allowedTransitionsFrom,
  canBookCodeExam,
  canForceTransition,
  routeEnrollment,
} from "./nephRouter";
import { checkNephFormat, normalizeNeph, toApiCategory } from "./neph";
import type { EnrollmentSnapshot } from "./types";

const NOW = new Date("2026-08-08T10:00:00Z");

function snapshot(overrides: Partial<EnrollmentSnapshot> = {}): EnrollmentSnapshot {
  return {
    neph: null,
    nephStatus: "absent",
    nephRequestedAt: null,
    nephGrantedAt: null,
    etgObtainedAt: null,
    category: "B",
    codengoMode: "manuel",
    antsMode: "manuel",
    hasActiveCodeRegistration: false,
    documentsComplete: false,
    ...overrides,
  };
}

/** Un NEPH attribué récemment, vérifié — le cas nominal. */
function verifiedNeph(overrides: Partial<EnrollmentSnapshot> = {}): EnrollmentSnapshot {
  return snapshot({
    neph: "051234567890",
    nephStatus: "verifie_ministere",
    nephGrantedAt: new Date("2026-01-15T00:00:00Z"),
    ...overrides,
  });
}

describe("routeEnrollment — branche sans NEPH", () => {
  it("oriente vers la collecte des pièces quand le dossier est vide", () => {
    const decision = routeEnrollment(snapshot(), NOW);
    expect(decision.status).toBe("dossier_a_constituer");
    expect(decision.nextAction.kind).toBe("collect_documents");
  });

  it("propose le dépôt une fois les pièces validées", () => {
    const decision = routeEnrollment(snapshot({ documentsComplete: true }), NOW);
    expect(decision.status).toBe("dossier_a_constituer");
    expect(decision.nextAction).toEqual({
      kind: "submit_ants_application",
      mode: "manuel",
    });
  });

  it("attend le NEPH sans alerter avant le délai constaté", () => {
    const decision = routeEnrollment(
      snapshot({
        nephStatus: "en_demande",
        nephRequestedAt: new Date("2026-08-02T00:00:00Z"), // 6 jours
        documentsComplete: true,
      }),
      NOW,
    );
    expect(decision.status).toBe("dossier_depose_ants");
    expect(decision.nextAction).toMatchObject({ kind: "await_neph", overdue: false });
    expect(decision.warnings).toHaveLength(0);
  });

  it("signale un dossier en retard au-delà du délai constaté", () => {
    const decision = routeEnrollment(
      snapshot({
        nephStatus: "en_demande",
        nephRequestedAt: new Date("2026-07-10T00:00:00Z"), // ~29 jours
        documentsComplete: true,
      }),
      NOW,
    );
    expect(decision.nextAction).toMatchObject({ kind: "await_neph", overdue: true });
    expect(decision.warnings.join(" ")).toContain("relancer");
  });
});

describe("routeEnrollment — la bifurcation code / conduite", () => {
  it("positionne sur le code quand l'ETG n'a jamais été obtenu", () => {
    const decision = routeEnrollment(verifiedNeph(), NOW);
    expect(decision.status).toBe("code_a_planifier");
    expect(decision.nextAction).toEqual({ kind: "book_code_exam", mode: "manuel" });
  });

  it("démarre la conduite quand l'ETG est encore valide", () => {
    const decision = routeEnrollment(
      verifiedNeph({ etgObtainedAt: new Date("2024-06-01T00:00:00Z") }),
      NOW,
    );
    expect(decision.status).toBe("formation_conduite");
    expect(decision.nextAction).toEqual({ kind: "start_driving" });
  });

  it("repositionne sur le code quand l'ETG a dépassé 5 ans", () => {
    const decision = routeEnrollment(
      verifiedNeph({ etgObtainedAt: new Date("2021-06-01T00:00:00Z") }),
      NOW,
    );
    expect(decision.status).toBe("code_a_planifier");
    expect(decision.warnings.join(" ")).toContain("plus de 5 ans");
  });

  it("traite la veille de l'expiration comme encore valide", () => {
    // Obtenu le 2021-08-09 → expire le 2026-08-09, soit demain.
    const decision = routeEnrollment(
      verifiedNeph({ etgObtainedAt: new Date("2021-08-09T00:00:00Z") }),
      NOW,
    );
    expect(decision.status).toBe("formation_conduite");
  });

  it("attend le résultat quand une inscription est déjà en cours", () => {
    const decision = routeEnrollment(
      verifiedNeph({ hasActiveCodeRegistration: true }),
      NOW,
    );
    expect(decision.status).toBe("code_reserve");
    expect(decision.nextAction).toEqual({ kind: "await_code_result" });
  });
});

describe("routeEnrollment — vérification du NEPH selon le mode", () => {
  it("exige la vérification ministérielle en mode automatisé", () => {
    const decision = routeEnrollment(
      verifiedNeph({ nephStatus: "declare", codengoMode: "automatise" }),
      NOW,
    );
    expect(decision.status).toBe("neph_a_verifier");
    expect(decision.nextAction).toEqual({ kind: "verify_neph" });
  });

  it("laisse avancer en mode manuel, mais avertit que rien n'est vérifié", () => {
    const decision = routeEnrollment(
      verifiedNeph({ nephStatus: "declare", codengoMode: "manuel" }),
      NOW,
    );
    expect(decision.status).toBe("code_a_planifier");
    expect(decision.warnings.join(" ")).toContain("non vérifié");
  });
});

describe("routeEnrollment — impasses administratives", () => {
  it("bloque sur un NEPH rejeté par le ministère", () => {
    const decision = routeEnrollment(
      verifiedNeph({ nephStatus: "invalide", etgObtainedAt: new Date("2025-01-01") }),
      NOW,
    );
    expect(decision.status).toBe("neph_invalide");
    expect(decision.nextAction).toEqual({ kind: "fix_neph" });
  });

  it("détecte un NEPH dormant même si le statut n'a pas été mis à jour", () => {
    const decision = routeEnrollment(
      verifiedNeph({ nephGrantedAt: new Date("2019-01-01T00:00:00Z") }),
      NOW,
    );
    expect(decision.status).toBe("neph_inactif");
    expect(decision.nextAction).toEqual({ kind: "reactivate_neph" });
  });
});

describe("canBookCodeExam — le verrou d'entrée", () => {
  it("autorise sans confirmation un NEPH vérifié", () => {
    const gate = canBookCodeExam(verifiedNeph());
    expect(gate).toMatchObject({ allowed: true, requiresAdminConfirmation: false });
  });

  it("refuse tant qu'aucun NEPH n'est attribué", () => {
    expect(canBookCodeExam(snapshot()).allowed).toBe(false);
    expect(canBookCodeExam(snapshot({ nephStatus: "en_demande" })).allowed).toBe(false);
  });

  it("refuse un NEPH déclaré quand la vérification est disponible", () => {
    const gate = canBookCodeExam(
      verifiedNeph({ nephStatus: "declare", codengoMode: "automatise" }),
    );
    expect(gate.allowed).toBe(false);
  });

  it("autorise un NEPH déclaré en mode manuel, sous confirmation explicite", () => {
    const gate = canBookCodeExam(
      verifiedNeph({ nephStatus: "declare", codengoMode: "manuel" }),
    );
    expect(gate).toMatchObject({ allowed: true, requiresAdminConfirmation: true });
  });

  it("refuse un NEPH invalide ou dormant", () => {
    expect(canBookCodeExam(verifiedNeph({ nephStatus: "invalide" })).allowed).toBe(false);
    expect(canBookCodeExam(verifiedNeph({ nephStatus: "inactif" })).allowed).toBe(false);
  });
});

describe("canForceTransition — pilotage manuel borné", () => {
  it("accepte une transition prévue accompagnée d'un motif", () => {
    const result = canForceTransition({
      from: "prospect",
      to: "code_a_planifier",
      source: "manual",
      reason: "Élève transféré, NEPH déjà attribué",
    });
    expect(result.allowed).toBe(true);
  });

  it("exige un motif pour toute transition manuelle", () => {
    const result = canForceTransition({
      from: "prospect",
      to: "code_a_planifier",
      source: "manual",
    });
    expect(result.allowed).toBe(false);
    expect(result.error).toContain("motif");
  });

  it("n'exige pas de motif pour une transition produite par l'API", () => {
    const result = canForceTransition({
      from: "code_reserve",
      to: "code_obtenu",
      source: "api",
    });
    expect(result.allowed).toBe(true);
  });

  it("refuse un saut non prévu", () => {
    const result = canForceTransition({
      from: "prospect",
      to: "permis_obtenu",
      source: "manual",
      reason: "raccourci",
    });
    expect(result.allowed).toBe(false);
    expect(result.error).toContain("non autorisée");
  });

  it("refuse une transition vers l'état courant", () => {
    const result = canForceTransition({
      from: "code_reserve",
      to: "code_reserve",
      source: "manual",
      reason: "resaisie",
    });
    expect(result.allowed).toBe(false);
  });

  it("ferme définitivement le parcours une fois le permis obtenu", () => {
    expect(allowedTransitionsFrom("permis_obtenu")).toEqual([]);
  });
});

describe("checkNephFormat", () => {
  it("accepte un NEPH canonique à 12 chiffres", () => {
    expect(checkNephFormat("051234567890")).toMatchObject({
      severity: "ok",
      normalized: "051234567890",
    });
  });

  it("nettoie les séparateurs recopiés par l'élève", () => {
    expect(normalizeNeph("05 12 34 56 78-90")).toBe("051234567890");
  });

  it("avertit sans rejeter sur une longueur inhabituelle", () => {
    // Longueur tirée des exemples du Swagger Code'nGo : 14 chiffres.
    const result = checkNephFormat("16586546548787");
    expect(result.severity).toBe("warning");
    expect(result.normalized).toBe("16586546548787");
  });

  it("rejette ce qui n'est pas numérique", () => {
    expect(checkNephFormat("05123456789X").severity).toBe("error");
  });

  it("rejette une longueur hors bornes", () => {
    expect(checkNephFormat("123").severity).toBe("error");
    expect(checkNephFormat("1".repeat(20)).severity).toBe("error");
  });

  it("avertit sur un mois incohérent sans bloquer", () => {
    const result = checkNephFormat("059934567890"); // mois « 99 »
    expect(result.severity).toBe("warning");
    expect(result.normalized).not.toBeNull();
  });
});

describe("toApiCategory", () => {
  it("mappe la famille voiture sur B", () => {
    expect(toApiCategory("B")).toBe("B");
    expect(toApiCategory("B78")).toBe("B");
    expect(toApiCategory("AAC")).toBe("B");
  });

  it("mappe la famille moto sur A", () => {
    expect(toApiCategory("A")).toBe("A");
    expect(toApiCategory("A1")).toBe("A");
    expect(toApiCategory("A2")).toBe("A");
  });
});
