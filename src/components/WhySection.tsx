import { CheckCircle } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import whyBg from "@/assets/why-bg.jpg";

const reasons = [
  { title: "Enseignant diplômé d'État", desc: "BEPECASER / Titre Pro ECSR. Pédagogie bienveillante et rigoureuse." },
  { title: "Sécurité routière au cœur", desc: "Formation conforme au REMC et au Programme National de Formation." },
  { title: "Véhicule récent double commande", desc: "Apprentissage en toute sécurité sur un véhicule moderne et confortable." },
  { title: "Réservation en ligne 24h/24", desc: "Réservez vos créneaux en ligne, y compris le samedi. On s'adapte à vous." },
  { title: "94% de taux de réussite", desc: "Préparation minutieuse pour maximiser vos chances dès le premier passage." },
  { title: "Tarifs transparents", desc: "Pas de frais cachés. Forfaits clairs et adaptés à votre budget." },
];

const WhySection = () => {
  const ref = useScrollReveal();

  return (
    <section id="why" className="relative py-24 lg:py-32 bg-charcoal-light text-primary-foreground overflow-hidden">
      {/* Photo right */}
      <div className="absolute top-0 right-0 w-[38%] h-full hidden lg:block">
        <img src={whyBg} alt="Conduite de nuit" className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal-light via-charcoal-light/80 to-transparent" />
      </div>

      <div className="container relative" ref={ref}>
        <div className="max-w-[60%] max-lg:max-w-full">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-4 opacity-0 translate-y-5 transition-all duration-700 [.is-visible_&]:opacity-100 [.is-visible_&]:translate-y-0">
            <div className="w-8 h-[2px] bg-gold" />
            <span className="text-[11px] font-bold tracking-[0.22em] uppercase text-gold">
              Pourquoi BeInDrive
            </span>
          </div>

          <h2 className="font-display font-[800] text-3xl sm:text-4xl lg:text-[44px] text-primary-foreground leading-tight tracking-[-1.5px] text-balance mb-5 opacity-0 translate-y-5 transition-all duration-700 delay-100 [.is-visible_&]:opacity-100 [.is-visible_&]:translate-y-0">
            L'excellence au service<br />de votre réussite
          </h2>

          <p className="text-primary-foreground/50 text-[15px] leading-relaxed max-w-md text-pretty mb-8 opacity-0 translate-y-5 transition-all duration-700 delay-150 [.is-visible_&]:opacity-100 [.is-visible_&]:translate-y-0">
            Chaque élève est unique. Notre approche pédagogique s'adapte à votre profil
            pour vous mener au permis avec confiance et sérénité.
          </p>

          {/* Quote */}
          <blockquote className="border-l-[3px] border-gold pl-6 mb-10 opacity-0 translate-y-5 transition-all duration-700 delay-200 [.is-visible_&]:opacity-100 [.is-visible_&]:translate-y-0">
            <p className="font-display italic text-primary-foreground/70 text-lg leading-relaxed">
              "Apprendre à conduire, c'est apprendre à partager la route responsablement."
            </p>
            <cite className="not-italic text-gold text-sm mt-2 block">— L'équipe BeInDrive</cite>
          </blockquote>

          {/* Grid */}
          <div className="grid sm:grid-cols-2 gap-3">
            {reasons.map((r, i) => (
              <div
                key={r.title}
                className="flex gap-3 items-start p-3.5 rounded-[10px] border border-white/[0.07] bg-white/[0.03] opacity-0 translate-y-4 transition-all duration-500 [.is-visible_&]:opacity-100 [.is-visible_&]:translate-y-0"
                style={{ transitionDelay: `${300 + i * 80}ms` }}
              >
                <CheckCircle className="w-4.5 h-4.5 text-gold mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-semibold text-primary-foreground text-sm mb-0.5">{r.title}</h3>
                  <p className="text-primary-foreground/40 text-xs leading-relaxed">{r.desc}</p>
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
