import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Clock, Star } from "lucide-react";
import ctaBg from "@/assets/cta-bg.jpg";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const CTASection = () => {
  const navigate = useNavigate();
  const ref = useScrollReveal();

  const trust = [
    { icon: ShieldCheck, label: "Sans engagement" },
    { icon: Clock, label: "Réponse sous 24h" },
    { icon: Star, label: "Éval. offerte" },
  ];

  return (
    <section className="relative min-h-[420px] flex items-center overflow-hidden">
      <img src={ctaBg} alt="Élève au volant" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(90deg, rgba(8,10,16,0.92) 0%, rgba(8,10,16,0.75) 50%, rgba(8,10,16,0.3) 100%)",
        }}
      />

      <div className="relative container py-20" ref={ref}>
        <div className="max-w-xl">
          <div className="flex items-center gap-3 mb-4 opacity-0 translate-y-5 transition-all duration-700 [.is-visible_&]:opacity-100 [.is-visible_&]:translate-y-0">
            <div className="w-8 h-[2px] bg-gold" />
            <span className="text-[11px] font-bold tracking-[0.22em] uppercase text-gold">Passez à l'action</span>
          </div>

          <h2 className="font-display font-[800] text-3xl sm:text-4xl lg:text-[44px] text-primary-foreground leading-tight tracking-[-1.5px] text-balance mb-5 opacity-0 translate-y-5 transition-all duration-700 delay-100 [.is-visible_&]:opacity-100 [.is-visible_&]:translate-y-0">
            Réservez votre première<br />heure de conduite
          </h2>

          <p className="text-primary-foreground/[0.55] text-[15px] leading-relaxed max-w-md text-pretty mb-8 opacity-0 translate-y-5 transition-all duration-700 delay-150 [.is-visible_&]:opacity-100 [.is-visible_&]:translate-y-0">
            Prenez rendez-vous en ligne en quelques clics. Nous vous recontactons
            pour confirmer votre créneau et organiser votre évaluation de départ.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-8 opacity-0 translate-y-5 transition-all duration-700 delay-200 [.is-visible_&]:opacity-100 [.is-visible_&]:translate-y-0">
            <Button variant="gold" size="xl" onClick={() => navigate("/booking")} className="group">
              Réserver un créneau
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              variant="hero-outline"
              size="xl"
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            >
              Nous contacter
            </Button>
          </div>

          <div className="flex items-center gap-6 opacity-0 translate-y-5 transition-all duration-700 delay-300 [.is-visible_&]:opacity-100 [.is-visible_&]:translate-y-0">
            {trust.map((t) => {
              const Icon = t.icon;
              return (
                <div key={t.label} className="flex items-center gap-2 text-primary-foreground/40 text-xs">
                  <Icon className="w-3.5 h-3.5 text-gold" />
                  {t.label}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
