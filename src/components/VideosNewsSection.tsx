import { Play, Clock, ArrowUpRight } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const videos = [
  { title: "Comment bien régler ses rétroviseurs", duration: "4:32", category: "Technique", color: "bg-blue-500/80" },
  { title: "Les 5 erreurs fatales à l'examen", duration: "6:15", category: "Examen", color: "bg-purple-500/80" },
  { title: "Comprendre les priorités à droite", duration: "3:48", category: "Code", color: "bg-emerald-500/80" },
];

const news = [
  { type: "Important", color: "bg-red-500/80", date: "12 mars 2026", title: "Réforme du permis 2026 : ce qui change", excerpt: "Les nouvelles mesures gouvernementales. Décryptage complet." },
  { type: "Conseils", color: "bg-blue-500/80", date: "8 mars 2026", title: "10 astuces pour réussir du premier coup", excerpt: "Nos meilleurs conseils pour aborder l'examen sereinement." },
  { type: "Examen", color: "bg-purple-500/80", date: "1 mars 2026", title: "Conduite accompagnée : guide complet", excerpt: "Tout savoir sur l'AAC : conditions, avantages, déroulement." },
  { type: "AAC", color: "bg-emerald-500/80", date: "22 fév 2026", title: "Bien choisir son accompagnateur", excerpt: "Les critères essentiels pour vos 3 000 km en conduite accompagnée." },
];

const VideosNewsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="media" className="py-24 lg:py-32 bg-background">
      <div className="container" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-14"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-[2px] bg-gold" />
            <span className="text-[11px] font-bold tracking-[0.22em] uppercase text-gold">Vidéos & Actualités</span>
          </div>
          <h2 className="font-display font-[800] text-3xl lg:text-[44px] text-foreground leading-[1.1] tracking-[-1.5px]">
            Apprenez au-delà des leçons
          </h2>
        </motion.div>

        {/* Videos */}
        <div className="grid sm:grid-cols-3 gap-5 mb-16">
          {videos.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 25 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15 + i * 0.08, duration: 0.6 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-video bg-charcoal rounded-xl overflow-hidden mb-3">
                <div className="absolute inset-0 bg-gradient-to-b from-charcoal/30 to-charcoal/70 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-gold/90 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-gold/20">
                    <Play className="w-5 h-5 text-charcoal ml-0.5" fill="currentColor" />
                  </div>
                </div>
                <div className="absolute top-3 left-3">
                  <span className={`${v.color} text-white text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full`}>
                    {v.category}
                  </span>
                </div>
                <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-charcoal/80 backdrop-blur-sm text-primary-foreground text-[11px] px-2 py-0.5 rounded-full">
                  <Clock className="w-3 h-3" />
                  {v.duration}
                </div>
              </div>
              <h4 className="font-display font-bold text-foreground text-sm group-hover:text-gold transition-colors duration-200 leading-snug">
                {v.title}
              </h4>
            </motion.div>
          ))}
        </div>

        {/* News */}
        <motion.h3
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="font-display font-[800] text-xl text-foreground mb-6"
        >
          Actualités
        </motion.h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {news.map((n, i) => (
            <motion.article
              key={n.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 + i * 0.06, duration: 0.5 }}
              className="group p-5 border border-border bg-card rounded-xl hover:border-gold/20 hover:shadow-md transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className={`${n.color} text-white text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full`}>
                  {n.type}
                </span>
                <span className="text-muted-foreground/50 text-xs">{n.date}</span>
              </div>
              <h4 className="font-display font-bold text-foreground text-sm mb-1.5 flex items-center gap-2 group-hover:text-gold transition-colors duration-200">
                {n.title}
                <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-40 transition-opacity duration-300" />
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
