import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import vig1 from "@/assets/vignette-1.jpg";
import vig2 from "@/assets/vignette-2.jpg";
import vig3 from "@/assets/vignette-3.jpg";
import vig4 from "@/assets/vignette-4.jpg";
import { motion } from "framer-motion";

const HeroSection = () => {
  const navigate = useNavigate();

  const stats = [
    { value: "94%", label: "Taux de réussite" },
    { value: "8+", label: "Ans d'expérience" },
    { value: "24h", label: "Première leçon" },
  ];

  const vignettes = [vig1, vig2, vig3, vig4];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <motion.img
          src={heroBg}
          alt="Leçon de conduite"
          className="w-full h-full object-cover"
          loading="eager"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        />
        <div className="absolute inset-0" style={{
          background: "linear-gradient(105deg, rgba(8,10,16,0.95) 0%, rgba(8,10,16,0.85) 35%, rgba(8,10,16,0.45) 65%, rgba(8,10,16,0.2) 100%)"
        }} />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-charcoal to-transparent" />
      </div>

      {/* Badge */}
      <div className="absolute top-24 right-6 lg:right-12 z-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full border border-gold/20 bg-gold/[0.06] backdrop-blur-sm"
        >
          <Shield className="w-3.5 h-3.5 text-gold" />
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gold">Diplômé d'État</span>
        </motion.div>
      </div>

      {/* Content */}
      <div className="relative container pt-32 pb-16 z-10">
        <div className="max-w-2xl">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="w-8 h-[2px] bg-gold" />
            <span className="text-[11px] font-bold tracking-[0.22em] uppercase text-gold">
              Auto-école premium · Paris
            </span>
          </motion.div>

          {/* Heading */}
          <h1 className="mb-8">
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-display font-[800] text-primary-foreground block leading-[0.95]"
              style={{ fontSize: "clamp(48px, 6.5vw, 84px)", letterSpacing: "-2.5px" }}
            >
              Be<span className="text-gold">In</span>Drive<span className="text-gold">.</span>
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-display font-bold text-primary-foreground/60 block leading-[1.15] mt-3"
              style={{ fontSize: "clamp(28px, 4vw, 50px)" }}
            >
              Conduire en toute
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-display font-bold italic text-gold block leading-[1.15]"
              style={{ fontSize: "clamp(28px, 4vw, 50px)" }}
            >
              confiance.
            </motion.span>
          </h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.6 }}
            className="text-primary-foreground/40 text-base max-w-[440px] leading-[1.75] mb-10"
          >
            Formation personnalisée au code et à la conduite avec un enseignant
            diplômé d'État. Réussissez dès la première tentative.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <Button variant="gold" size="xl" onClick={() => navigate("/booking")} className="group">
              <span className="flex items-center gap-2">
                Réserver un créneau
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Button>
            <Button
              variant="hero-outline"
              size="xl"
              onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })}
            >
              Découvrir nos formations
            </Button>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="mt-20 pt-8 border-t border-white/[0.08] flex gap-14 max-w-md"
        >
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="font-display font-[800] text-[40px] leading-none text-gold tracking-tight">{stat.value}</div>
              <div className="text-primary-foreground/25 text-[10px] font-semibold tracking-[0.2em] uppercase mt-2">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Vignettes */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="mt-8 flex items-center gap-2"
        >
          {vignettes.map((v, i) => (
            <img
              key={i}
              src={v}
              alt="Élève en situation"
              className="w-16 h-11 rounded-lg object-cover border border-white/[0.1] hover:border-gold/30 transition-all duration-300"
              loading="lazy"
            />
          ))}
          <span className="text-primary-foreground/15 text-[11px] ml-3 hidden sm:block">
            Nos élèves en situation réelle
          </span>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
