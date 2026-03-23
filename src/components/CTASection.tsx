import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Clock, Star } from "lucide-react";
import ctaBg from "@/assets/cta-bg.jpg";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const ease = [0.16, 1, 0.3, 1] as const;

const CTASection = () => {
  const navigate = useNavigate();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const trust = [
    { icon: ShieldCheck, label: "Sans engagement" },
    { icon: Clock, label: "Réponse sous 24h" },
    { icon: Star, label: "Éval. offerte" },
  ];

  return (
    <section ref={ref} className="relative min-h-[460px] flex items-center overflow-hidden grain">
      <motion.img
        src={ctaBg}
        alt="Élève au volant"
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
        initial={{ scale: 1.08 }}
        whileInView={{ scale: 1 }}
        transition={{ duration: 1.5, ease }}
        viewport={{ once: true }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(90deg, rgba(8,10,16,0.94) 0%, rgba(8,10,16,0.8) 45%, rgba(8,10,16,0.35) 100%)",
        }}
      />

      <div className="relative container py-24">
        <div className="max-w-xl">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease }}
            className="flex items-center gap-4 mb-5"
          >
            <div className="w-10 h-[2px] bg-gold" />
            <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-gold">Passez à l'action</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.8, ease }}
            className="font-display font-[800] text-3xl sm:text-4xl lg:text-[48px] text-primary-foreground leading-[1.1] tracking-[-2px] text-balance mb-6"
          >
            Réservez votre première<br />heure de conduite
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.7, ease }}
            className="text-primary-foreground/40 text-[15px] leading-[1.7] max-w-md text-pretty mb-9"
          >
            Prenez rendez-vous en ligne en quelques clics. Nous vous recontactons
            pour confirmer votre créneau et organiser votre évaluation de départ.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.7, ease }}
            className="flex flex-col sm:flex-row gap-4 mb-10"
          >
            <Button variant="gold" size="xl" onClick={() => navigate("/booking")} className="group">
              Réserver un créneau
              <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1.5" />
            </Button>
            <Button
              variant="hero-outline"
              size="xl"
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            >
              Nous contacter
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5, duration: 0.7, ease }}
            className="flex items-center gap-8"
          >
            {trust.map((t) => {
              const Icon = t.icon;
              return (
                <div key={t.label} className="flex items-center gap-2.5 text-primary-foreground/30 text-xs">
                  <Icon className="w-4 h-4 text-gold/70" />
                  <span className="font-medium">{t.label}</span>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
