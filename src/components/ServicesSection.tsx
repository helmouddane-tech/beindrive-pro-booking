import { BookOpen, Car, Users, Gauge, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const formations = [
  {
    num: "01",
    icon: BookOpen,
    title: "Code de la route",
    desc: "Préparation intensive à l'examen théorique général (ETG). Accès plateforme en ligne + séances collectives.",
    price: "dès 300€",
    details: "Accès illimité",
    featured: false,
  },
  {
    num: "02",
    icon: Car,
    title: "Permis B",
    desc: "20 heures minimum de conduite obligatoires. Formation sur véhicule récent à double commande. Boîte manuelle ou BEA (13h).",
    price: "dès 990€",
    details: "20h minimum",
    featured: false,
  },
  {
    num: "03",
    icon: Users,
    title: "Conduite accompagnée",
    desc: "AAC dès 15 ans. 3 000 km minimum avec un accompagnateur. Taux de réussite supérieur, probatoire réduit à 2 ans.",
    price: "dès 1 100€",
    details: "Dès 15 ans",
    featured: true,
    badge: "Recommandé",
  },
  {
    num: "04",
    icon: Gauge,
    title: "Perfectionnement",
    desc: "Remise à niveau, conduite de nuit, autoroute, stationnement. Pour gagner en confiance sur la route.",
    price: "sur devis",
    details: "Sur mesure",
    featured: false,
  },
];

const ease = [0.16, 1, 0.3, 1] as const;

const ServicesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="services" className="py-28 lg:py-36 bg-background relative overflow-hidden">
      {/* Subtle grid bg */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
        backgroundSize: "60px 60px"
      }} />

      <div className="container relative" ref={ref}>
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease }}
          >
            <div className="flex items-center gap-4 mb-5">
              <div className="w-10 h-[2px] bg-gold" />
              <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-gold">
                Nos formations
              </span>
            </div>
            <h2 className="font-display font-[800] text-3xl sm:text-4xl lg:text-[48px] text-foreground leading-[1.1] tracking-[-2px] text-balance">
              Un parcours conçu pour<br className="hidden sm:block" />chaque profil
            </h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15, duration: 0.7, ease }}
            className="text-muted-foreground text-[15px] max-w-sm leading-relaxed text-pretty lg:text-right"
          >
            Du code à la conduite, chaque formation est pensée pour vous accompagner vers la réussite.
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-[1px] bg-border rounded-xl overflow-hidden shadow-xl shadow-black/[0.04]">
          {formations.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.num}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.7, ease }}
                className={`relative p-7 pt-9 flex flex-col group cursor-pointer transition-all duration-300 ${
                  f.featured
                    ? "bg-charcoal text-primary-foreground"
                    : "bg-card text-card-foreground hover:bg-secondary/50"
                }`}
              >
                {/* Top accent line */}
                <div className={`absolute top-0 left-0 right-0 h-[3px] transition-all duration-300 ${
                  f.featured ? "bg-gold" : "bg-transparent group-hover:bg-gold"
                }`} />

                {f.badge && (
                  <span className="absolute top-4 right-4 bg-gold text-charcoal text-[9px] font-bold tracking-[0.15em] uppercase px-2.5 py-1 rounded-full">
                    {f.badge}
                  </span>
                )}

                <span className={`text-[11px] font-semibold tracking-[0.2em] ${f.featured ? "text-primary-foreground/20" : "text-muted-foreground/30"}`}>
                  {f.num}
                </span>

                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mt-5 mb-6 transition-all duration-300 ${
                  f.featured
                    ? "bg-gold/10 group-hover:bg-gold/20"
                    : "bg-secondary group-hover:bg-gold/10"
                }`}>
                  <Icon className={`w-5 h-5 transition-colors duration-300 ${f.featured ? "text-gold" : "text-foreground group-hover:text-gold"}`} />
                </div>

                <h3 className="font-display font-[800] text-lg mb-2.5 tracking-[-0.5px] flex items-center gap-2">
                  {f.title}
                  <ArrowUpRight className={`w-3.5 h-3.5 opacity-0 -translate-y-1 translate-x-1 transition-all duration-300 group-hover:opacity-60 group-hover:translate-y-0 group-hover:translate-x-0 ${
                    f.featured ? "text-primary-foreground" : "text-foreground"
                  }`} />
                </h3>
                <p className={`text-[13px] leading-relaxed flex-1 ${f.featured ? "text-primary-foreground/45" : "text-muted-foreground"}`}>
                  {f.desc}
                </p>

                <div className={`mt-7 pt-4 border-t flex items-center justify-between ${f.featured ? "border-white/[0.08]" : "border-border"}`}>
                  <span className="font-display font-[800] text-gold text-lg tracking-tight">{f.price}</span>
                  <span className={`text-[10px] font-semibold tracking-[0.15em] uppercase ${f.featured ? "text-primary-foreground/25" : "text-muted-foreground/40"}`}>
                    {f.details}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
