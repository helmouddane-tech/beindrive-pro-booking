import { BookOpen, Car, Users, Shield, FileCheck, Clock } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: BookOpen,
    title: "Code de la route",
    description:
      "Formation accélérée ou classique avec cours en salle et accès en ligne 24h/24. Entraînement illimité aux examens blancs. Examen passé dans un centre agréé (La Poste, SGS…).",
    accent: "Dès 300€",
    details: ["Cours collectifs en salle", "Accès plateforme en ligne illimité", "Séries d'examen type ETG", "Préparation à l'examen théorique général"],
    badge: null,
  },
  {
    icon: Car,
    title: "Permis B – Boîte manuelle",
    description:
      "20 heures de conduite minimum (obligation légale). Formation complète avec un enseignant diplômé ECSR. Passage de l'examen pratique inclus.",
    accent: "Dès 990€",
    details: ["20h de conduite obligatoires", "Livret d'apprentissage numérique", "Bilan de compétences", "Accompagnement à l'examen pratique"],
    badge: null,
  },
  {
    icon: Users,
    title: "Conduite Accompagnée (AAC)",
    description:
      "Dès 15 ans. Apprentissage anticipé de la conduite : 20h avec moniteur puis 3 000 km minimum avec un accompagnateur. Meilleur taux de réussite et période probatoire réduite à 2 ans.",
    accent: "Dès 1 100€",
    details: ["Accessible dès 15 ans", "3 000 km min. en conduite accompagnée", "2 rendez-vous pédagogiques obligatoires", "Période probatoire réduite (2 ans au lieu de 3)"],
    badge: "Recommandé",
  },
  {
    icon: FileCheck,
    title: "Conduite Supervisée",
    description:
      "Pour les 18 ans et plus qui souhaitent acquérir plus d'expérience avant l'examen. 1 000 km minimum avec un accompagnateur après la formation initiale.",
    accent: "Dès 1 050€",
    details: ["À partir de 18 ans", "1 000 km minimum requis", "1 rendez-vous pédagogique", "Complémentaire à la formation initiale"],
    badge: null,
  },
  {
    icon: Clock,
    title: "Permis B – Boîte automatique (BEA)",
    description:
      "13 heures de conduite minimum au lieu de 20. Formation plus courte, idéale si vous ne souhaitez conduire qu'en automatique. Passerelle vers la boîte manuelle possible après 3 mois.",
    accent: "Dès 790€",
    details: ["13h de conduite (au lieu de 20)", "Véhicule à boîte automatique", "Passerelle BEA → B après 3 mois", "7h de formation complémentaire pour la passerelle"],
    badge: "Formation courte",
  },
  {
    icon: Shield,
    title: "Perfectionnement & Post-permis",
    description:
      "Remise à niveau après une longue période sans conduire, conduite sur autoroute, stage post-permis (réduction de la période probatoire).",
    accent: "Sur devis",
    details: ["Remise à niveau personnalisée", "Conduite autoroute & périphérique", "Stage post-permis (6-12 mois après obtention)", "Renforcement de la confiance au volant"],
    badge: null,
  },
];

const ServicesSection = () => {
  const ref = useScrollReveal();
  const navigate = useNavigate();

  return (
    <section id="services" className="py-24 lg:py-32 bg-background">
      <div className="container" ref={ref}>
        <div className="text-center max-w-2xl mx-auto mb-16 opacity-0 transition-all duration-700 [.is-visible_&]:opacity-100 [.is-visible_&]:translate-y-0 translate-y-5">
          <p className="text-gold font-semibold text-sm tracking-[0.2em] uppercase mb-3">
            Nos formations
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground text-balance leading-tight mb-4">
            Des formations adaptées à chaque profil
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Toutes nos formations respectent le programme national de formation (PNF) 
            et le REMC (Référentiel pour l'Éducation à une Mobilité Citoyenne).
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <div
              key={s.title}
              className="group relative bg-card rounded-xl p-7 shadow-sm hover:shadow-xl hover:shadow-charcoal/5 transition-all duration-500 border border-border hover:border-gold/30 opacity-0 translate-y-5 [.is-visible_&]:opacity-100 [.is-visible_&]:translate-y-0 flex flex-col"
              style={{ transitionDelay: `${150 + i * 80}ms` }}
            >
              {s.badge && (
                <span className="absolute -top-3 right-5 bg-gold text-accent-foreground text-xs font-bold px-3 py-1 rounded-full shadow-md">
                  {s.badge}
                </span>
              )}
              <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center mb-5 group-hover:bg-gold/20 transition-colors duration-300">
                <s.icon className="w-6 h-6 text-gold" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                {s.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed text-pretty mb-4 flex-1">
                {s.description}
              </p>
              <ul className="space-y-2 mb-5">
                {s.details.map((d) => (
                  <li key={d} className="flex items-start gap-2 text-xs text-muted-foreground/80">
                    <span className="w-1 h-1 rounded-full bg-gold mt-1.5 shrink-0" />
                    {d}
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                <span className="text-gold font-display font-bold text-lg">{s.accent}</span>
                <Button variant="ghost" size="sm" className="text-gold hover:text-gold hover:bg-gold/10" onClick={() => navigate("/auth")}>
                  En savoir plus →
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
