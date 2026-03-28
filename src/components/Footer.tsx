import { MapPin, Phone, Mail, Shield } from "lucide-react";
import logo from "@/assets/logo-beindrive.png";

const Footer = () => {
  return (
    <footer id="contact" className="bg-charcoal text-primary-foreground border-t-[3px] border-t-gold relative grain">
      <div className="container py-16 lg:py-20 relative z-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="mb-4">
              <img src={logo} alt="BeInDrive" className="h-12 w-auto object-contain" />
            </div>
            <p className="text-primary-foreground/30 text-sm leading-relaxed max-w-xs mb-5">
              Auto-école agréée. Formation au code et à la conduite
              avec un enseignant diplômé d'État (Titre Pro ECSR).
            </p>
            <div className="flex items-start gap-2 text-xs text-primary-foreground/15">
              <Shield className="w-3.5 h-3.5 text-gold/40 mt-0.5 shrink-0" />
              <span>Agrément préfectoral n° E XX XXX XXXX X</span>
            </div>
          </div>

          {/* Formations */}
          <div>
            <h4 className="font-display font-[800] text-sm mb-5 tracking-[-0.3px] uppercase text-primary-foreground/60">Formations</h4>
            <ul className="space-y-2.5 text-sm text-primary-foreground/30">
              {["Code de la route (ETG)", "Permis B — Boîte manuelle", "Conduite Accompagnée (AAC)", "Perfectionnement"].map(l => (
                <li key={l}><a href="#services" className="hover:text-gold transition-colors duration-200">{l}</a></li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-display font-[800] text-sm mb-5 tracking-[-0.3px] uppercase text-primary-foreground/60">Informations</h4>
            <ul className="space-y-2.5 text-sm text-primary-foreground/30">
              {[
                { label: "À propos", href: "#why" },
                { label: "Vidéos & News", href: "#media" },
                { label: "Mentions légales", href: "#" },
                { label: "CGV", href: "#" },
              ].map(l => (
                <li key={l.label}><a href={l.href} className="hover:text-gold transition-colors duration-200">{l.label}</a></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-[800] text-sm mb-5 tracking-[-0.3px] uppercase text-primary-foreground/60">Contact</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/30">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold/60 mt-0.5 shrink-0" />
                <span>12 Rue de la République<br />75001 Paris</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gold/60 shrink-0" />
                <a href="tel:+33123456789" className="hover:text-gold transition-colors duration-200">01 23 45 67 89</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-gold/60 shrink-0" />
                <a href="mailto:contact@beindrive.com" className="hover:text-gold transition-colors duration-200">contact@beindrive.com</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/[0.05] relative z-10">
        <div className="container py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-primary-foreground/15 text-xs">
            © {new Date().getFullYear()} Beindrive · SIRET : XXX XXX XXX XXXXX
          </p>
          <div className="flex gap-5 text-xs text-primary-foreground/15">
            <a href="#" className="hover:text-gold transition-colors duration-200">Mentions légales</a>
            <a href="#" className="hover:text-gold transition-colors duration-200">CGV</a>
            <a href="#" className="hover:text-gold transition-colors duration-200">Confidentialité</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
