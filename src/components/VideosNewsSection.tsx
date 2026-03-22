import { Play, Clock } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const videos = [
  { title: "Comment bien régler ses rétroviseurs", duration: "4:32", category: "Technique", categoryColor: "bg-blue-500" },
  { title: "Les 5 erreurs fatales à l'examen du permis", duration: "6:15", category: "Examen", categoryColor: "bg-purple-500" },
  { title: "Comprendre les priorités à droite", duration: "3:48", category: "Code", categoryColor: "bg-green-500" },
];

const news = [
  { type: "Important", color: "bg-red-500", date: "12 mars 2026", title: "Réforme du permis 2026 : ce qui change", excerpt: "Les nouvelles mesures gouvernementales impactent les auto-écoles. Décryptage complet des changements." },
  { type: "Conseils", color: "bg-blue-500", date: "8 mars 2026", title: "10 astuces pour réussir du premier coup", excerpt: "Nos meilleurs conseils pour aborder l'examen sereinement et maximiser vos chances." },
  { type: "Examen", color: "bg-purple-500", date: "1 mars 2026", title: "Conduite accompagnée : le guide complet", excerpt: "Tout ce qu'il faut savoir sur l'AAC : conditions, avantages, déroulement." },
  { type: "AAC", color: "bg-emerald-500", date: "22 fév 2026", title: "Bien choisir son accompagnateur", excerpt: "Les critères essentiels pour sélectionner la bonne personne pour vos 3 000 km." },
];

const VideosNewsSection = () => {
  const ref = useScrollReveal();

  return (
    <section id="media" className="py-24 lg:py-32 bg-background">
      <div className="container" ref={ref}>
        {/* Header */}
        <div className="mb-16 opacity-0 translate-y-5 transition-all duration-700 [.is-visible_&]:opacity-100 [.is-visible_&]:translate-y-0">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-[2px] bg-gold" />
            <span className="text-[11px] font-bold tracking-[0.22em] uppercase text-gold">Vidéos & Actualités</span>
          </div>
          <h2 className="font-display font-[800] text-3xl sm:text-4xl lg:text-[44px] text-foreground leading-tight tracking-[-1.5px]">
            Apprenez au-delà des leçons
          </h2>
        </div>

        {/* Videos */}
        <h3 className="font-display font-[800] text-xl text-foreground mb-6 opacity-0 translate-y-4 transition-all duration-700 delay-100 [.is-visible_&]:opacity-100 [.is-visible_&]:translate-y-0">
          Vidéos pédagogiques
        </h3>
        <div className="grid sm:grid-cols-3 gap-5 mb-16">
          {videos.map((v, i) => (
            <div
              key={v.title}
              className="group cursor-pointer opacity-0 translate-y-4 transition-all duration-600 [.is-visible_&]:opacity-100 [.is-visible_&]:translate-y-0"
              style={{ transitionDelay: `${200 + i * 100}ms` }}
            >
              <div className="relative aspect-video bg-charcoal rounded-lg overflow-hidden mb-3">
                <div className="absolute inset-0 bg-charcoal/60 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-gold flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <Play className="w-5 h-5 text-charcoal ml-0.5" fill="currentColor" />
                  </div>
                </div>
                <div className="absolute top-3 left-3">
                  <span className={`${v.categoryColor} text-white text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-sm`}>
                    {v.category}
                  </span>
                </div>
                <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-charcoal/80 text-primary-foreground text-[11px] px-2 py-0.5 rounded-sm">
                  <Clock className="w-3 h-3" />
                  {v.duration}
                </div>
              </div>
              <h4 className="font-display font-bold text-foreground text-sm group-hover:text-gold transition-colors duration-200">
                {v.title}
              </h4>
            </div>
          ))}
        </div>

        {/* News */}
        <h3 className="font-display font-[800] text-xl text-foreground mb-6 opacity-0 translate-y-4 transition-all duration-700 delay-200 [.is-visible_&]:opacity-100 [.is-visible_&]:translate-y-0">
          Actualités
        </h3>
        <div className="grid sm:grid-cols-2 gap-5">
          {news.map((n, i) => (
            <article
              key={n.title}
              className="p-5 border border-border bg-card rounded-lg hover:border-gold transition-colors duration-200 cursor-pointer opacity-0 translate-y-4 [.is-visible_&]:opacity-100 [.is-visible_&]:translate-y-0"
              style={{ transitionDelay: `${300 + i * 80}ms`, transitionDuration: "600ms" }}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className={`${n.color} text-white text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-sm`}>
                  {n.type}
                </span>
                <span className="text-muted-foreground text-xs">{n.date}</span>
              </div>
              <h4 className="font-display font-bold text-foreground mb-2">{n.title}</h4>
              <p className="text-muted-foreground text-[13px] leading-relaxed">{n.excerpt}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VideosNewsSection;
