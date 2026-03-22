import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Award } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import vig1 from "@/assets/vignette-1.jpg";
import vig2 from "@/assets/vignette-2.jpg";
import vig3 from "@/assets/vignette-3.jpg";
import vig4 from "@/assets/vignette-4.jpg";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const HeroSection = () => {
  const ref = useScrollReveal();
  const navigate = useNavigate();

  const stats = [
    { value: "94%", label: "Taux de réussite" },
    { value: "8+", label: "Ans d'expérience" },
    { value: "24h", label: "Première leçon" },
  ];

  const vignettes = [vig1, vig2, vig3, vig4];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background photo */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="Leçon de conduite en ville" className="w-full h-full object-cover" loading="eager" />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(105deg, rgba(8,10,16,0.93) 0%, rgba(8,10,16,0.78) 42%, rgba(8,10,16,0.35) 70%, rgba(8,10,16,0.12) 100%)",
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-charcoal to-transparent" />
      </div>

      {/* Top bar */}
      <div className="absolute top-20 left-0 right-0">
        <div className="container flex items-center justify-between">
          <span className="text-[11px] font-bold tracking-[0.22em] uppercase text-primary-foreground/40 animate-reveal">
            Auto-école premium
          </span>
          <div className="hidden sm:flex items-center gap-2 text-[11px] font-bold tracking-[0.18em] uppercase text-gold animate-reveal animate-reveal-delay-1">
            <Award className="w-3.5 h-3.5" />
            BEPECASER · Diplômé d'État
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative container pt-36 pb-16" ref={ref}>
        <div className="max-w-2xl">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-6 animate-reveal">
            <div className="w-8 h-[2px] bg-gold" />
            <span className="text-[11px] font-bold tracking-[0.22em] uppercase text-gold">
              Votre permis. Votre liberté.
            </span>
          </div>

          {/* H1 */}
          <h1 className="mb-6 animate-reveal animate-reveal-delay-1">
            <span
              className="font-display font-[800] text-primary-foreground block leading-[1.05]"
              style={{ fontSize: "clamp(52px, 7vw, 88px)", letterSpacing: "-3px" }}
            >
              Be<span className="text-gold">[In]</span>Drive<span className="text-gold">.</span>
            </span>
            <span
              className="font-display font-bold text-primary-foreground/70 block leading-[1.15] mt-1"
              style={{ fontSize: "clamp(34px, 4.5vw, 56px)" }}
            >
              Conduire en toute
            </span>
            <span
              className="font-display font-bold italic text-gold block leading-[1.15]"
              style={{ fontSize: "clamp(34px, 4.5vw, 56px)" }}
            >
              sécurité.
            </span>
          </h1>

          {/* Description */}
          <p className="text-primary-foreground/[0.55] text-[17px] max-w-[480px] leading-relaxed text-pretty mb-10 animate-reveal animate-reveal-delay-2">
            Formation personnalisée au code et à la conduite avec un enseignant diplômé d'État.
            Accompagnement professionnel pour réussir dès la première tentative.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 animate-reveal animate-reveal-delay-3">
            <Button variant="gold" size="xl" onClick={() => navigate("/booking")} className="group">
              Réserver un créneau
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              variant="hero-outline"
              size="xl"
              onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })}
            >
              Nos formations
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 pt-8 border-t border-white/10 grid grid-cols-3 gap-8 max-w-md animate-reveal animate-reveal-delay-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center sm:text-left">
              <div className="font-display font-[800] text-[40px] leading-none text-gold">{stat.value}</div>
              <div className="text-primary-foreground/40 text-[11px] font-medium tracking-[0.15em] uppercase mt-2">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Vignettes */}
        <div className="mt-10 flex items-center gap-3 animate-reveal animate-reveal-delay-5">
          {vignettes.map((v, i) => (
            <img
              key={i}
              src={v}
              alt="Élève en situation"
              className="w-[76px] h-[52px] rounded-lg object-cover border border-white/[0.14]"
              loading="lazy"
            />
          ))}
          <span className="text-primary-foreground/30 text-xs ml-2 hidden sm:block">
            Nos élèves en situation réelle
          </span>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
