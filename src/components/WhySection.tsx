import { CheckCircle } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import whyBg from "@/assets/why-bg.jpg";

const reasons = [
  { title: "Enseignant diplômé d'État", desc: "BEPECASER / Titre Pro ECSR. Pédagogie bienveillante et rigoureuse." },
  { title: "Sécurité routière au cœur", desc: "Formation conforme au REMC et au Programme National de Formation." },
  { title: "Véhicule récent double commande", desc: "Apprentissage sécurisé sur un véhicule moderne et confortable." },
  { title: "Réservation en ligne 24h/24", desc: "Réservez vos créneaux quand vous voulez. On s'adapte à vous." },
  { title: "94% de taux de réussite", desc: "Préparation minutieuse pour maximiser vos chances au premier passage." },
  { title: "Tarifs transparents", desc: "Pas de frais cachés. Forfaits clairs adaptés à votre budget." },
];

const ease = [0.16, 1, 0.3, 1] as const;

const WhySection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="why" className="relative py-28 lg:py-36 bg-charcoal text-primary-foreground overflow-hidden grain">
      {/* Photo right */}
      <div className="absolute top-0 right-0 w-[42%] h-full hidden lg:block">
        <motion.img
          src={whyBg}
          alt="Conduite de nuit"
          className="w-full h-full object-cover"
          loading="lazy"
          initial={{ scale: 1.1 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 1.5, ease }}
          viewport={{ once: true }}
        />
        <div className="absolute inset-0" style={{
          background: "linear-gradient(90deg, hsl(228 30% 5%) 0%, hsl(228 30% 5% / 0.85) 30%, hsl(228 30% 5% / 0.4) 70%, transparent 100%)"
        }} />
      </div>

      <div className="container relative" ref={ref}>
        <div className="max-w-[55%] max-lg:max-w-full">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease }}
            className="flex items-center gap-4 mb-5"
          >
            <div className="w-10 h-[2px] bg-gold" />
            <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-gold">
              Pourquoi BeInDrive
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.8, ease }}
            className="font-display font-[800] text-3xl sm:text-4xl lg:text-[48px] text-primary-foreground leading-[1.1] tracking-[-2px] text-balance mb-6"
          >
            L'excellence au service<br />de votre réussite
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.7, ease }}
            className="text-primary-foreground/40 text-[15px] leading-[1.7] max-w-md text-pretty mb-10"
          >
            Chaque élève est unique. Notre approche pédagogique s'adapte à votre profil
            pour vous mener au permis avec confiance et sérénité.
          </motion.p>

          {/* Quote */}
          <motion.blockquote
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.7, ease }}
            className="border-l-[3px] border-gold pl-7 mb-12"
          >
            <p className="font-display italic text-primary-foreground/60 text-lg leading-relaxed">
              "Apprendre à conduire, c'est apprendre à partager la route responsablement."
            </p>
            <cite className="not-italic text-gold text-sm mt-3 block font-medium">— L'équipe BeInDrive</cite>
          </motion.blockquote>

          {/* Grid */}
          <div className="grid sm:grid-cols-2 gap-3">
            {reasons.map((r, i) => (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4 + i * 0.08, duration: 0.6, ease }}
                className="flex gap-3.5 items-start p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm hover:border-gold/20 hover:bg-white/[0.04] transition-all duration-300 group"
              >
                <CheckCircle className="w-[18px] h-[18px] text-gold mt-0.5 shrink-0 transition-transform duration-300 group-hover:scale-110" />
                <div>
                  <h3 className="font-semibold text-primary-foreground text-[14px] mb-1">{r.title}</h3>
                  <p className="text-primary-foreground/35 text-[12.5px] leading-relaxed">{r.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhySection;
