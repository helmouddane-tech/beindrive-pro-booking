import signsBg from "@/assets/signs-band.jpg";

const items = [
  { top: "Code de la route", bottom: "Formation complète" },
  { top: "Signalisation", bottom: "Maîtrisée" },
  { top: "Sécurité", bottom: "Priorité absolue" },
];

const SignBandSection = () => (
  <section className="relative h-[160px] overflow-hidden">
    <img src={signsBg} alt="Panneaux de signalisation français" className="w-full h-full object-cover" loading="lazy" />
    <div className="absolute inset-0" style={{ background: "rgba(10,12,20,0.74)" }} />
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="container flex items-center justify-center gap-12 sm:gap-20">
        {items.map((item, i) => (
          <div key={i} className="text-center">
            <div className="font-display font-[800] text-primary-foreground text-lg sm:text-xl tracking-[-0.5px]">
              {item.top}
            </div>
            <div className="text-[11px] font-bold tracking-[0.22em] uppercase text-gold mt-1">
              {item.bottom}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default SignBandSection;
