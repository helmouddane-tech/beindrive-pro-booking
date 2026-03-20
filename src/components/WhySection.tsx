import { CheckCircle } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const reasons = [
  {
    title: "Enseignant diplômé d'État",
    description: "BEPECASER / Titre Pro ECSR. Pédagogie bienveillante et rigoureuse.",
  },
  {
    title: "Véhicule récent et confortable",
    description: "Apprentissage dans les meilleures conditions avec un véhicule moderne.",
  },
  {
    title: "Horaires flexibles",
    description: "Réservez vos créneaux en ligne, y compris le samedi. On s'adapte à vous.",
  },
  {
    title: "Suivi personnalisé",
    description: "Tableau de bord en ligne pour suivre votre progression en temps réel.",
  },
  {
    title: "Taux de réussite supérieur",
    description: "94% de réussite au permis B grâce à une préparation minutieuse.",
  },
  {
    title: "Transparence tarifaire",
    description: "Pas de frais cachés. Forfaits clairs et adaptés à votre budget.",
  },
];

const WhySection = () => {
  const ref = useScrollReveal();

  return (
    <section id="why" className="py-24 lg:py-32 bg-charcoal text-primary-foreground">
      <div className="container" ref={ref}>
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div className="opacity-0 translate-y-5 transition-all duration-700 [.is-visible_&]:opacity-100 [.is-visible_&]:translate-y-0">
            <p className="text-gold font-semibold text-sm tracking-[0.2em] uppercase mb-3">
              Pourquoi BeinDrive
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground text-balance leading-tight mb-6">
              L'excellence au service de votre réussite
            </h2>
            <p className="text-primary-foreground/60 text-lg leading-relaxed max-w-md text-pretty">
              Chaque élève est unique. Notre approche pédagogique s'adapte à votre profil 
              pour vous mener au permis avec confiance et sérénité.
            </p>
          </div>

          <div className="grid gap-5">
            {reasons.map((r, i) => (
              <div
                key={r.title}
                className="flex gap-4 items-start opacity-0 translate-y-4 transition-all duration-600 [.is-visible_&]:opacity-100 [.is-visible_&]:translate-y-0"
                style={{ transitionDelay: `${200 + i * 80}ms` }}
              >
                <CheckCircle className="w-5 h-5 text-gold mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-semibold text-primary-foreground mb-1">{r.title}</h3>
                  <p className="text-primary-foreground/50 text-sm leading-relaxed">{r.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhySection;
