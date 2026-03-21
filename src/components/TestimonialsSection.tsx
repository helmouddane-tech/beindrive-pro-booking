import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Léa M.",
    age: "18 ans",
    formation: "Conduite Accompagnée (AAC)",
    text: "J'ai commencé la conduite accompagnée à 15 ans chez BeinDrive. L'enseignant est patient, pédagogue et met vraiment en confiance. J'ai eu mon permis du premier coup avec 30/31 !",
    rating: 5,
  },
  {
    name: "Karim B.",
    age: "24 ans",
    formation: "Permis B – Boîte manuelle",
    text: "Après un échec dans une autre auto-école, j'ai repris chez BeinDrive. La méthode est structurée, le suivi en ligne est top et les créneaux sont flexibles. Permis obtenu en 2 mois.",
    rating: 5,
  },
  {
    name: "Sophie L.",
    age: "35 ans",
    formation: "Perfectionnement",
    text: "Je n'avais pas conduit depuis 10 ans. Grâce aux heures de perfectionnement, j'ai repris confiance sur la route. Les cours sont adaptés à mon niveau et mes besoins.",
    rating: 5,
  },
  {
    name: "Antoine R.",
    age: "19 ans",
    formation: "Permis B – BEA",
    text: "J'ai choisi le permis boîte automatique. En 13h c'était plié ! L'enseignant connaît parfaitement les parcours d'examen. Je recommande à 100%.",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  const ref = useScrollReveal();

  return (
    <section className="py-24 lg:py-32 bg-charcoal text-primary-foreground overflow-hidden">
      <div className="container" ref={ref}>
        <div className="text-center max-w-2xl mx-auto mb-16 opacity-0 transition-all duration-700 [.is-visible_&]:opacity-100 [.is-visible_&]:translate-y-0 translate-y-5">
          <p className="text-gold font-semibold text-sm tracking-[0.2em] uppercase mb-3">
            Témoignages
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground text-balance leading-tight mb-4">
            Ils ont obtenu leur permis avec nous
          </h2>
          <p className="text-primary-foreground/50 text-lg leading-relaxed">
            Plus de 500 élèves formés. Découvrez leurs retours d'expérience.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className="relative bg-charcoal-light/50 border border-primary-foreground/10 rounded-xl p-6 opacity-0 translate-y-5 transition-all duration-700 [.is-visible_&]:opacity-100 [.is-visible_&]:translate-y-0 hover:border-gold/20 group"
              style={{ transitionDelay: `${200 + i * 100}ms` }}
            >
              <Quote className="w-8 h-8 text-gold/20 mb-4" />
              <p className="text-primary-foreground/70 text-sm leading-relaxed mb-6 italic">
                "{t.text}"
              </p>
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-3.5 h-3.5 fill-gold text-gold" />
                ))}
              </div>
              <div>
                <p className="font-semibold text-primary-foreground text-sm">{t.name}</p>
                <p className="text-primary-foreground/40 text-xs">{t.age} · {t.formation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
