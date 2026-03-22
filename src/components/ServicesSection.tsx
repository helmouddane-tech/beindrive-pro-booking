import { BookOpen, Car, Users, Gauge } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const formations = [
  {
    num: "01",
    icon: BookOpen,
    title: "Code de la route",
    desc: "Préparation intensive à l'examen théorique général (ETG). Accès à la plateforme en ligne + séances collectives en salle.",
    price: "dès 300€",
    featured: false,
  },
  {
    num: "02",
    icon: Car,
    title: "Permis B",
    desc: "20 heures minimum de conduite obligatoires. Formation complète sur véhicule récent à double commande. Boîte manuelle ou BEA (13h).",
    price: "dès 990€",
    featured: false,
  },
  {
    num: "03",
    icon: Users,
    title: "Conduite accompagnée",
    desc: "AAC dès 15 ans. 3 000 km minimum avec un accompagnateur. Taux de réussite supérieur et période probatoire réduite à 2 ans.",
    price: "dès 1 100€",
    featured: true,
    badge: "Recommandé",
  },
  {
    num: "04",
    icon: Gauge,
    title: "Perfectionnement",
    desc: "Remise à niveau, conduite de nuit, autoroute, stationnement. Adapté aux conducteurs souhaitant gagner en confiance.",
    price: "sur devis",
    featured: false,
  },
];

const ServicesSection = () => {
  const ref = useScrollReveal();

  return (
    <section id="services" className="py-24 lg:py-32 bg-background">
      <div className="container" ref={ref}>
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16 opacity-0 translate-y-5 transition-all duration-700 [.is-visible_&]:opacity-100 [.is-visible_&]:translate-y-0">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-[2px] bg-gold" />
              <span className="text-[11px] font-bold tracking-[0.22em] uppercase text-gold">
                Nos formations
              </span>
            </div>
            <h2 className="font-display font-[800] text-3xl sm:text-4xl lg:text-[44px] text-foreground leading-tight tracking-[-1.5px] text-balance">
              Un parcours conçu pour<br />chaque profil
            </h2>
          </div>
          <p className="text-muted-foreground text-[15px] max-w-md leading-relaxed text-pretty lg:text-right">
            Du code à la conduite, chaque formation est pensée pour vous accompagner
            vers la réussite avec rigueur et bienveillance.
          </p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-[2px]">
          {formations.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={f.num}
                className={`relative p-6 pt-8 flex flex-col transition-all duration-200 group opacity-0 translate-y-4 [.is-visible_&]:opacity-100 [.is-visible_&]:translate-y-0 ${
                  f.featured
                    ? "bg-charcoal text-primary-foreground border-t-[3px] border-t-gold"
                    : "bg-card text-card-foreground border-t-[3px] border-t-transparent hover:border-t-gold"
                }`}
                style={{ transitionDelay: `${200 + i * 100}ms` }}
              >
                {f.badge && (
                  <span className="absolute top-3 right-3 bg-gold text-charcoal text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-sm">
                    {f.badge}
                  </span>
                )}

                <span className={`text-xs font-medium tracking-wider ${f.featured ? "text-primary-foreground/30" : "text-muted-foreground/40"}`}>
                  {f.num}
                </span>

                <div className={`w-10 h-10 rounded-md flex items-center justify-center mt-4 mb-5 ${f.featured ? "bg-white/[0.08]" : "bg-secondary"}`}>
                  <Icon className={`w-5 h-5 ${f.featured ? "text-gold" : "text-foreground"}`} />
                </div>

                <h3 className="font-display font-[800] text-lg mb-2 tracking-[-0.5px]">{f.title}</h3>
                <p className={`text-[13px] leading-relaxed flex-1 ${f.featured ? "text-primary-foreground/50" : "text-muted-foreground"}`}>
                  {f.desc}
                </p>

                <div className={`mt-6 pt-4 border-t ${f.featured ? "border-white/10" : "border-border"}`}>
                  <span className="font-display font-[800] text-gold text-lg">{f.price}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
