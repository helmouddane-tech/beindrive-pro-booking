import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Clock, Star } from "lucide-react";
import ctaBg from "@/assets/cta-bg.jpg";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

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
    <section ref={ref} className="relative min-h-[420px] flex items-center overflow-hidden grain">
      <motion.img
        src={ctaBg}
        alt="Élève au volant"
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
        initial={{ scale: 1.05 }}
        whileInView={{ scale: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true }}
      />
      <div className="absolute inset-0" style={{
        background: "linear-gradient(90deg, rgba(8,10,16,0.94) 0%, rgba(8,10,16,0.8) 45%, rgba(8,10,16,0.3) 100%)"
      }} />

      <div className="relative container py-20">
        <div className="max-w-lg">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="w-8 h-[2px] bg-gold" />
            <span className="text-[11px] font-bold tracking-[0.22em] uppercase text-gold">Passez à l'action</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="font-display font-[800] text-3xl lg:text-[44px] text-primary-foreground leading-[1.1] tracking-[-1.5px] mb-5"
          >
            Réservez votre première<br />heure de conduite
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-primary-foreground/35 text-sm leading-[1.8] max-w-md mb-8"
          >
            Prenez rendez-vous en quelques clics. Nous vous recontactons pour
            confirmer votre créneau et organiser votre évaluation.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-3 mb-8"
          >
            <Button variant="gold" size="xl" onClick={() => navigate("/booking")} className="group">
              Réserver un créneau
              <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
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
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex items-center gap-7"
          >
            {trust.map((t) => {
              const Icon = t.icon;
              return (
                <div key={t.label} className="flex items-center gap-2 text-primary-foreground/25 text-xs">
                  <Icon className="w-3.5 h-3.5 text-gold/60" />
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
