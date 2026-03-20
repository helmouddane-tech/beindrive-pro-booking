import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const HeroSection = () => {
  const ref = useScrollReveal();

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="Voiture sur une route française au coucher du soleil"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-charcoal/65" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-charcoal/30" />
      </div>

      {/* Content */}
      <div className="relative container pt-32 pb-24" ref={ref}>
        <div className="max-w-2xl">
          <p className="text-gold font-body text-sm font-semibold tracking-[0.2em] uppercase mb-6 animate-reveal">
            Auto-école premium
          </p>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-primary-foreground leading-[1.05] text-balance mb-6 animate-reveal animate-reveal-delay-1">
            Votre permis,
            <br />
            notre expertise
          </h1>
          <p className="text-primary-foreground/70 text-lg sm:text-xl max-w-lg leading-relaxed text-pretty mb-10 animate-reveal animate-reveal-delay-2">
            Formation personnalisée au code et à la conduite. 
            Accompagnement professionnel pour réussir dès la première tentative.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 animate-reveal animate-reveal-delay-3">
            <Button variant="hero" size="xl">
              Réserver un créneau
            </Button>
            <Button variant="hero-outline" size="xl">
              Nos formations
            </Button>
          </div>
        </div>

        {/* Stats bar */}
        <div className="mt-20 grid grid-cols-3 gap-8 max-w-lg animate-reveal animate-reveal-delay-4">
          {[
            { value: "94%", label: "Taux de réussite" },
            { value: "8+", label: "Ans d'expérience" },
            { value: "24h", label: "Première leçon" },
          ].map((stat) => (
            <div key={stat.label} className="text-center sm:text-left">
              <div className="font-display text-3xl sm:text-4xl font-bold text-gold">
                {stat.value}
              </div>
              <div className="text-primary-foreground/50 text-xs sm:text-sm mt-1 tracking-wide">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
