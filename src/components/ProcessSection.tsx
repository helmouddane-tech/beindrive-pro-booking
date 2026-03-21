import { useScrollReveal } from "@/hooks/useScrollReveal";
import { ClipboardCheck, BookOpen, Car, Award } from "lucide-react";

const steps = [
  {
    icon: ClipboardCheck,
    step: "01",
    title: "Inscription & Évaluation",
    description:
      "Évaluation de départ obligatoire (article R.245-2 du Code de la route) pour estimer le volume d'heures de conduite nécessaire. Constitution de votre dossier ANTS (numéro NEPH).",
  },
  {
    icon: BookOpen,
    step: "02",
    title: "Formation au Code (ETG)",
    description:
      "Cours en salle et en ligne pour préparer l'Examen Théorique Général. 40 questions, 35 bonnes réponses minimum pour obtenir le code. Valable 5 ans.",
  },
  {
    icon: Car,
    step: "03",
    title: "Formation Pratique",
    description:
      "20h minimum de conduite (13h en BEA). Apprentissage progressif selon les 4 compétences du REMC : maîtrise du véhicule, appréhension de la route, circulation, autonomie.",
  },
  {
    icon: Award,
    step: "04",
    title: "Examen & Obtention du Permis",
    description:
      "32 minutes d'épreuve pratique. Résultat sous 48h sur le site de la Sécurité Routière. En cas de réussite, votre permis est un permis probatoire (6 points).",
  },
];

const ProcessSection = () => {
  const ref = useScrollReveal();

  return (
    <section className="py-24 lg:py-32 bg-muted/30 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
      
      <div className="container relative" ref={ref}>
        <div className="text-center max-w-2xl mx-auto mb-20 opacity-0 transition-all duration-700 [.is-visible_&]:opacity-100 [.is-visible_&]:translate-y-0 translate-y-5">
          <p className="text-gold font-semibold text-sm tracking-[0.2em] uppercase mb-3">
            Votre parcours
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground text-balance leading-tight mb-4">
            Du premier cours au permis en poche
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Un accompagnement structuré, étape par étape, conforme à la réglementation française.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8 relative">
          {/* Connection line */}
          <div className="hidden md:block absolute top-16 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-gold/0 via-gold/30 to-gold/0" />

          {steps.map((s, i) => (
            <div
              key={s.step}
              className="relative text-center opacity-0 translate-y-5 transition-all duration-700 [.is-visible_&]:opacity-100 [.is-visible_&]:translate-y-0"
              style={{ transitionDelay: `${200 + i * 120}ms` }}
            >
              <div className="relative mx-auto w-20 h-20 rounded-2xl bg-card border-2 border-gold/20 flex items-center justify-center mb-6 shadow-lg shadow-gold/5">
                <s.icon className="w-8 h-8 text-gold" />
                <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-gold text-accent-foreground font-bold text-xs flex items-center justify-center shadow-md">
                  {s.step}
                </span>
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-3">
                {s.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {s.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
