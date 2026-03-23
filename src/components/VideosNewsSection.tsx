import { Play, Clock, ArrowUpRight } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const videos = [
  { title: "Comment bien régler ses rétroviseurs", duration: "4:32", category: "Technique", categoryColor: "bg-blue-500/90" },
  { title: "Les 5 erreurs fatales à l'examen du permis", duration: "6:15", category: "Examen", categoryColor: "bg-purple-500/90" },
  { title: "Comprendre les priorités à droite", duration: "3:48", category: "Code", categoryColor: "bg-emerald-500/90" },
];

const news = [
  { type: "Important", color: "bg-red-500/90", date: "12 mars 2026", title: "Réforme du permis 2026 : ce qui change", excerpt: "Les nouvelles mesures gouvernementales impactent les auto-écoles. Décryptage." },
  { type: "Conseils", color: "bg-blue-500/90", date: "8 mars 2026", title: "10 astuces pour réussir du premier coup", excerpt: "Nos meilleurs conseils pour aborder l'examen sereinement." },
  { type: "Examen", color: "bg-purple-500/90", date: "1 mars 2026", title: "Conduite accompagnée : le guide complet", excerpt: "Tout savoir sur l'AAC : conditions, avantages, déroulement." },
  { type: "AAC", color: "bg-emerald-500/90", date: "22 fév 2026", title: "Bien choisir son accompagnateur", excerpt: "Les critères essentiels pour vos 3 000 km de conduite accompagnée." },
];

const ease = [0.16, 1, 0.3, 1] as const;

const VideosNewsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="media" className="py-28 lg:py-36 bg-background relative overflow-hidden">
      <div className="container" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease }}
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-5">
            <div className="w-10 h-[2px] bg-gold" />
            <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-gold">Vidéos & Actualités</span>
          </div>
          <h2 className="font-display font-[800] text-3xl sm:text-4xl lg:text-[48px] text-foreground leading-[1.1] tracking-[-2px]">
            Apprenez au-delà des leçons
          </h2>
        </motion.div>

        {/* Videos */}
        <motion.h3
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2, duration: 0.6, ease }}
          className="font-display font-[800] text-xl text-foreground mb-7"
        >
          Vidéos pédagogiques
        </motion.h3>
        <div className="grid sm:grid-cols-3 gap-6 mb-20">
          {videos.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.7, ease }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-video bg-charcoal rounded-xl overflow-hidden mb-4 shadow-lg shadow-black/[0.06]">
                <div className="absolute inset-0 bg-gradient-to-b from-charcoal/20 to-charcoal/70 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-gold/90 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 group-hover:bg-gold transition-all duration-300 shadow-lg shadow-gold/20">
                    <Play className="w-5 h-5 text-charcoal ml-0.5" fill="currentColor" />
                  </div>
                </div>
                <div className="absolute top-3 left-3">
                  <span className={`${v.categoryColor} text-white text-[10px] font-bold tracking-[0.12em] uppercase px-2.5 py-1 rounded-full backdrop-blur-sm`}>
                    {v.category}
                  </span>
                </div>
                <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-charcoal/80 backdrop-blur-sm text-primary-foreground text-[11px] px-2.5 py-1 rounded-full">
                  <Clock className="w-3 h-3" />
                  {v.duration}
                </div>
              </div>
              <h4 className="font-display font-bold text-foreground text-[15px] group-hover:text-gold transition-colors duration-300 leading-snug">
                {v.title}
              </h4>
            </motion.div>
          ))}
        </div>

        {/* News */}
        <motion.h3
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.6, ease }}
          className="font-display font-[800] text-xl text-foreground mb-7"
        >
          Actualités
        </motion.h3>
        <div className="grid sm:grid-cols-2 gap-5">
          {news.map((n, i) => (
            <motion.article
              key={n.title}
              initial={{ opacity: 0, y: 25 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6 + i * 0.08, duration: 0.6, ease }}
              className="group p-6 border border-border bg-card rounded-xl hover:border-gold/30 hover:shadow-lg hover:shadow-gold/[0.04] transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className={`${n.color} text-white text-[10px] font-bold tracking-[0.12em] uppercase px-2.5 py-1 rounded-full`}>
                  {n.type}
                </span>
                <span className="text-muted-foreground/60 text-xs">{n.date}</span>
              </div>
              <h4 className="font-display font-bold text-foreground mb-2 flex items-center gap-2 group-hover:text-gold transition-colors duration-300">
                {n.title}
                <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
              </h4>
              <p className="text-muted-foreground text-[13px] leading-relaxed">{n.excerpt}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VideosNewsSection;
