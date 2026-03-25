import { BookOpen, Car, Users, Gauge, ArrowRight } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const formations = [
  {
    num: "01",
    icon: BookOpen,
    title: "Code de la route",
    desc: "Préparation intensive à l'ETG. Accès plateforme en ligne illimité + séances en salle.",
    price: "dès 300€",
    tag: "Accès illimité",
    featured: false,
  },
  {
    num: "02",
    icon: Car,
    title: "Permis B",
    desc: "20 heures minimum obligatoires. Véhicule récent à double commande. Boîte manuelle ou BEA (13h).",
    price: "dès 990€",
    tag: "20h minimum",
    featured: false,
  },
  {
    num: "03",
    icon: Users,
    title: "Conduite accompagnée",
    desc: "AAC dès 15 ans. 3 000 km minimum avec accompagnateur. Probatoire réduit à 2 ans.",
    price: "dès 1 100€",
    tag: "Dès 15 ans",
    featured: true,
    badge: "Recommandé",
  },
  {
    num: "04",
    icon: Gauge,
    title: "Perfectionnement",
    desc: "Remise à niveau, conduite de nuit, autoroute, stationnement. Retrouvez confiance.",
    price: "sur devis",
    tag: "Sur mesure",
    featured: false,
  },
];

const ServicesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="services" className="py-24 lg:py-32 bg-background relative">
      <div className="container" ref={ref}>
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-[2px] bg-gold" />
              <span className="text-[11px] font-bold tracking-[0.22em] uppercase text-gold">Nos formations</span>
            </div>
            <h2 className="font-display font-[800] text-3xl lg:text-[44px] text-foreground leading-[1.1] tracking-[-1.5px]">
              Un parcours adapté<br className="hidden sm:block" />à chaque profil
            </h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-muted-foreground text-sm max-w-xs leading-relaxed lg:text-right"
          >
            Du code à la conduite, chaque formation vous accompagne vers la réussite.
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {formations.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.num}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.15 + i * 0.08, duration: 0.6 }}
                className={`relative p-6 rounded-xl flex flex-col group cursor-pointer transition-all duration-300 border ${
                  f.featured
                    ? "bg-charcoal text-primary-foreground border-gold/20 shadow-xl shadow-gold/[0.06]"
                    : "bg-card text-card-foreground border-border hover:border-gold/20 hover:shadow-lg hover:shadow-black/[0.04]"
                }`}
              >
                {f.badge && (
                  <span className="absolute top-4 right-4 bg-gold text-charcoal text-[9px] font-bold tracking-[0.15em] uppercase px-2.5 py-1 rounded-full">
                    {f.badge}
                  </span>
                )}

                <span className={`text-[11px] font-medium tracking-wider ${f.featured ? "text-primary-foreground/15" : "text-muted-foreground/30"}`}>
                  {f.num}
                </span>

                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mt-4 mb-5 ${
                  f.featured ? "bg-gold/10" : "bg-secondary"
                }`}>
                  <Icon className={`w-5 h-5 ${f.featured ? "text-gold" : "text-foreground/70"}`} />
                </div>

                <h3 className="font-display font-[800] text-lg mb-2 tracking-[-0.5px] flex items-center gap-2">
                  {f.title}
                  <ArrowRight className={`w-3.5 h-3.5 opacity-0 group-hover:opacity-50 transition-all duration-300 group-hover:translate-x-0.5 ${
                    f.featured ? "text-primary-foreground" : "text-foreground"
                  }`} />
                </h3>

                <p className={`text-[13px] leading-relaxed flex-1 ${f.featured ? "text-primary-foreground/40" : "text-muted-foreground"}`}>
                  {f.desc}
                </p>

                <div className={`mt-6 pt-4 border-t flex items-center justify-between ${f.featured ? "border-white/[0.08]" : "border-border"}`}>
                  <span className="font-display font-[800] text-gold text-lg tracking-tight">{f.price}</span>
                  <span className={`text-[10px] font-medium tracking-wider uppercase ${f.featured ? "text-primary-foreground/20" : "text-muted-foreground/40"}`}>
                    {f.tag}
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
