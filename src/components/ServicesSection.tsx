import { BookOpen, Car, Users, Shield } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const services = [
  {
    icon: BookOpen,
    title: "Code de la route",
    description:
      "Formation accélérée ou classique avec cours en salle et accès en ligne 24h/24. Entraînement illimité aux examens blancs.",
    accent: "Dès 300€",
  },
  {
    icon: Car,
    title: "Permis B",
    description:
      "20 heures de conduite minimum avec un enseignant diplômé. Parcours adapté à votre rythme et vos disponibilités.",
    accent: "Dès 990€",
  },
  {
    icon: Users,
    title: "Conduite accompagnée",
    description:
      "AAC dès 15 ans pour un apprentissage progressif et sécurisé. Meilleur taux de réussite à l'examen.",
    accent: "Dès 1 100€",
  },
  {
    icon: Shield,
    title: "Perfectionnement",
    description:
      "Remise à niveau, conduite sur autoroute, confiance au volant. Pour les conducteurs qui veulent progresser.",
    accent: "Sur devis",
  },
];

const ServicesSection = () => {
  const ref = useScrollReveal();

  return (
    <section id="services" className="py-24 lg:py-32 bg-background">
      <div className="container" ref={ref}>
        <div className="text-center max-w-xl mx-auto mb-16 opacity-0 transition-all duration-700 [.is-visible_&]:opacity-100 [.is-visible_&]:translate-y-0 translate-y-5">
          <p className="text-gold font-semibold text-sm tracking-[0.2em] uppercase mb-3">
            Nos formations
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground text-balance leading-tight">
            Un parcours adapté à chaque profil
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s, i) => (
            <div
              key={s.title}
              className={`group relative bg-card rounded-xl p-7 shadow-sm hover:shadow-xl hover:shadow-charcoal/5 transition-all duration-500 border border-border hover:border-gold/30 opacity-0 translate-y-5 [.is-visible_&]:opacity-100 [.is-visible_&]:translate-y-0`}
              style={{ transitionDelay: `${150 + i * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center mb-5 group-hover:bg-gold/20 transition-colors duration-300">
                <s.icon className="w-6 h-6 text-gold" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                {s.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed text-pretty mb-4">
                {s.description}
              </p>
              <span className="text-gold font-semibold text-sm">{s.accent}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
