import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Award, ChevronDown } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import vig1 from "@/assets/vignette-1.jpg";
import vig2 from "@/assets/vignette-2.jpg";
import vig3 from "@/assets/vignette-3.jpg";
import vig4 from "@/assets/vignette-4.jpg";
import { motion } from "framer-motion";

const ease = [0.16, 1, 0.3, 1];

const HeroSection = () => {
  const navigate = useNavigate();

  const stats = [
    { value: "94%", label: "Taux de réussite" },
    { value: "8+", label: "Ans d'expérience" },
    { value: "24h", label: "Première leçon" },
  ];

  const vignettes = [vig1, vig2, vig3, vig4];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden grain">
      {/* Background */}
      <div className="absolute inset-0">
        <motion.img
          src={heroBg}
          alt="Leçon de conduite en ville"
          className="w-full h-full object-cover"
          loading="eager"
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, ease }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(105deg, rgba(8,10,16,0.95) 0%, rgba(8,10,16,0.82) 38%, rgba(8,10,16,0.4) 65%, rgba(8,10,16,0.15) 100%)",
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-charcoal to-transparent" />
      </div>

      {/* Top bar */}
      <div className="absolute top-20 left-0 right-0 z-10">
        <div className="container flex items-center justify-between">
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.6, ease }}
            className="text-[11px] font-bold tracking-[0.25em] uppercase text-primary-foreground/30"
          >
            Auto-école premium · Paris
          </motion.span>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9, duration: 0.6, ease }}
            className="hidden sm:flex items-center gap-2.5 px-4 py-2 rounded-full border border-gold/20 bg-gold/[0.06] backdrop-blur-sm"
          >
            <Award className="w-3.5 h-3.5 text-gold" />
            <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-gold">
              Diplômé d'État
            </span>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="relative container pt-36 pb-20 z-10">
        <div className="max-w-2xl">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease }}
            className="flex items-center gap-4 mb-8"
          >
            <div className="w-10 h-[2px] bg-gold" />
            <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-gold">
              Votre permis. Votre liberté.
            </span>
          </motion.div>

          {/* H1 */}
          <h1 className="mb-8">
            <motion.span
              initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.5, duration: 1, ease }}
              className="font-display font-[800] text-primary-foreground block leading-[0.95]"
              style={{ fontSize: "clamp(52px, 7vw, 92px)", letterSpacing: "-3px" }}
            >
              Be<span className="text-gold">[In]</span>Drive<span className="text-gold">.</span>
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.65, duration: 1, ease }}
              className="font-display font-bold text-primary-foreground/65 block leading-[1.1] mt-2"
              style={{ fontSize: "clamp(30px, 4.2vw, 54px)" }}
            >
              Conduire en toute
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.8, duration: 1, ease }}
              className="font-display font-bold italic text-gold block leading-[1.1]"
              style={{ fontSize: "clamp(30px, 4.2vw, 54px)" }}
            >
              sécurité.
            </motion.span>
          </h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.95, duration: 0.8, ease }}
            className="text-primary-foreground/45 text-[17px] max-w-[460px] leading-[1.7] text-pretty mb-10"
          >
            Formation personnalisée au code et à la conduite avec un enseignant diplômé d'État.
            Accompagnement professionnel pour réussir dès la première tentative.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.7, ease }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button variant="gold" size="xl" onClick={() => navigate("/booking")} className="group relative overflow-hidden">
              <span className="relative z-10 flex items-center gap-2">
                Réserver un créneau
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
              </span>
            </Button>
            <Button
              variant="hero-outline"
              size="xl"
              onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })}
            >
              Nos formations
            </Button>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.8, ease }}
          className="mt-20 pt-8 border-t border-white/[0.08] flex gap-12 sm:gap-16 max-w-lg"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 + i * 0.1, duration: 0.6, ease }}
            >
              <div className="font-display font-[800] text-[44px] leading-none text-gold tracking-tight">{stat.value}</div>
              <div className="text-primary-foreground/30 text-[10px] font-semibold tracking-[0.2em] uppercase mt-2.5">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Vignettes */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.8, ease }}
          className="mt-10 flex items-center gap-2.5"
        >
          {vignettes.map((v, i) => (
            <motion.img
              key={i}
              src={v}
              alt="Élève en situation"
              className="w-[72px] h-[50px] rounded-lg object-cover border border-white/[0.1] hover:border-gold/40 transition-all duration-300 hover:scale-105"
              loading="lazy"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.7 + i * 0.08, duration: 0.5, ease }}
            />
          ))}
          <span className="text-primary-foreground/20 text-[11px] ml-3 hidden sm:block tracking-wide">
            Nos élèves en situation réelle
          </span>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5 text-primary-foreground/20" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
