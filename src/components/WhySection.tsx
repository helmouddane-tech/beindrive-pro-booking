import { CheckCircle } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import whyBg from "@/assets/why-bg.jpg";

const reasons = [
  { title: "Enseignant diplômé d'État", desc: "BEPECASER / Titre Pro ECSR." },
  { title: "Sécurité routière au cœur", desc: "Formation conforme au REMC." },
  { title: "Véhicule récent double commande", desc: "Apprentissage confortable et sécurisé." },
  { title: "Réservation en ligne 24h/24", desc: "Réservez quand vous voulez." },
  { title: "94% de taux de réussite", desc: "Préparation minutieuse." },
  { title: "Tarifs transparents", desc: "Pas de frais cachés." },
];

const WhySection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="why" className="relative py-24 lg:py-32 bg-charcoal text-primary-foreground overflow-hidden grain">
      {/* Photo right */}
      <div className="absolute top-0 right-0 w-[40%] h-full hidden lg:block">
        <motion.img
          src={whyBg}
          alt="Conduite de nuit"
          className="w-full h-full object-cover"
          loading="lazy"
          initial={{ scale: 1.05 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
        />
        <div className="absolute inset-0" style={{
          background: "linear-gradient(90deg, hsl(225 25% 5%) 0%, hsl(225 25% 5% / 0.85) 30%, transparent 100%)"
        }} />
      </div>

      <div className="container relative" ref={ref}>
        <div className="max-w-[55%] max-lg:max-w-full">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="w-8 h-[2px] bg-gold" />
            <span className="text-[11px] font-bold tracking-[0.22em] uppercase text-gold">Pourquoi Beindrive</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="font-display font-[800] text-3xl lg:text-[44px] text-primary-foreground leading-[1.1] tracking-[-1.5px] mb-5"
          >
            L'excellence au service<br />de votre réussite
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-primary-foreground/35 text-sm leading-[1.8] max-w-md mb-8"
          >
            Notre approche pédagogique s'adapte à votre profil pour vous mener
            au permis avec confiance et sérénité.
          </motion.p>

          {/* Quote */}
          <motion.blockquote
            initial={{ opacity: 0, x: -15 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="border-l-[3px] border-gold pl-6 mb-10"
          >
            <p className="font-display italic text-primary-foreground/50 text-lg leading-relaxed">
              "Apprendre à conduire, c'est apprendre à partager la route."
            </p>
            <cite className="not-italic text-gold text-sm mt-2 block font-medium">— L'équipe Beindrive</cite>
          </motion.blockquote>

          {/* Grid */}
          <div className="grid sm:grid-cols-2 gap-2.5">
            {reasons.map((r, i) => (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, y: 15 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.35 + i * 0.06, duration: 0.5 }}
                className="flex gap-3 items-start p-3.5 rounded-lg border border-white/[0.05] bg-white/[0.02] hover:border-gold/15 transition-all duration-300"
              >
                <CheckCircle className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-semibold text-primary-foreground text-[13px] mb-0.5">{r.title}</h3>
                  <p className="text-primary-foreground/30 text-[12px] leading-relaxed">{r.desc}</p>
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
