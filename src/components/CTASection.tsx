import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const CTASection = () => {
  const ref = useScrollReveal();

  return (
    <section className="py-24 lg:py-32 bg-background relative overflow-hidden">
      {/* Subtle decorative element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gold/5 blur-3xl pointer-events-none" />
      
      <div className="container relative" ref={ref}>
        <div className="max-w-2xl mx-auto text-center opacity-0 translate-y-5 transition-all duration-700 [.is-visible_&]:opacity-100 [.is-visible_&]:translate-y-0">
          <p className="text-gold font-semibold text-sm tracking-[0.2em] uppercase mb-3">
            Prêt à démarrer ?
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground text-balance leading-tight mb-6">
            Réservez votre première heure de conduite
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mb-10 text-pretty">
            Choisissez votre créneau en ligne et commencez votre formation dès cette semaine. 
            Évaluation de départ offerte.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center opacity-0 translate-y-4 transition-all duration-700 delay-200 [.is-visible_&]:opacity-100 [.is-visible_&]:translate-y-0">
            <Button variant="gold" size="xl">
              Réserver en ligne
            </Button>
            <Button variant="outline" size="xl">
              Nous appeler
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
