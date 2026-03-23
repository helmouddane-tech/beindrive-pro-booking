import signsBg from "@/assets/signs-band.jpg";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const items = [
  { value: "ETG", label: "Code de la route" },
  { value: "100%", label: "Signalisation maîtrisée" },
  { value: "N°1", label: "Priorité sécurité" },
];

const ease = [0.16, 1, 0.3, 1] as const;

const SignBandSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <section ref={ref} className="relative h-[180px] overflow-hidden">
      <img src={signsBg} alt="Panneaux de signalisation français" className="w-full h-full object-cover" loading="lazy" />
      <div className="absolute inset-0 bg-charcoal/[0.78] backdrop-blur-[2px]" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="container flex items-center justify-center gap-16 sm:gap-24">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12, duration: 0.7, ease }}
              className="text-center"
            >
              <div className="font-display font-[800] text-gold text-2xl sm:text-3xl tracking-tight">
                {item.value}
              </div>
              <div className="text-primary-foreground/30 text-[10px] font-semibold tracking-[0.2em] uppercase mt-1.5">
                {item.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SignBandSection;
