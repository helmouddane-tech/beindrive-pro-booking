import { MapPin, Phone, Mail, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer id="contact" className="bg-charcoal text-primary-foreground border-t-[3px] border-t-gold relative grain">
      <div className="container py-20 lg:py-24 relative z-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-14">
          {/* Brand */}
          <div>
            <span className="font-display font-[800] text-2xl tracking-[-1.5px] mb-5 block">
              Be<span className="text-gold">[In]</span>Drive
            </span>
            <p className="text-primary-foreground/[0.35] text-sm leading-relaxed max-w-xs mb-6">
              Auto-école agréée par la Préfecture. Formation au code de la route et à la conduite
              avec un enseignant titulaire du Titre Professionnel ECSR.
            </p>
            <div className="flex items-start gap-2 text-xs text-primary-foreground/[0.15]">
              <Shield className="w-3.5 h-3.5 text-gold/40 mt-0.5 shrink-0" />
              <span>Agrément préfectoral n° E XX XXX XXXX X</span>
            </div>
            <div className="flex gap-3 mt-6">
              {["Fb", "Ig", "Tk"].map((s) => (
                <a key={s} href="#" className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-primary-foreground/30 hover:text-gold hover:border-gold/30 hover:bg-gold/[0.06] transition-all duration-300 text-[10px] font-bold">
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Formations */}
          <div>
            <h4 className="font-display font-[800] text-lg mb-6 tracking-[-0.5px]">Formations</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/[0.35]">
              {["Code de la route (ETG)", "Permis B — Boîte manuelle", "Conduite Accompagnée (AAC)", "Perfectionnement"].map(l => (
                <li key={l}><a href="#services" className="hover:text-gold transition-colors duration-300">{l}</a></li>
              ))}
            </ul>
          </div>

          {/* Informations */}
          <div>
            <h4 className="font-display font-[800] text-lg mb-6 tracking-[-0.5px]">Informations</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/[0.35]">
              {[
                { label: "À propos", href: "#why" },
                { label: "Vidéos & News", href: "#media" },
                { label: "Mentions légales", href: "#" },
                { label: "CGV", href: "#" },
              ].map(l => (
                <li key={l.label}><a href={l.href} className="hover:text-gold transition-colors duration-300">{l.label}</a></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-[800] text-lg mb-6 tracking-[-0.5px]">Contact</h4>
            <ul className="space-y-4 text-sm text-primary-foreground/[0.35]">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gold/70 mt-0.5 shrink-0" />
                <span>12 Rue de la République<br />75001 Paris</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gold/70 shrink-0" />
                <a href="tel:+33123456789" className="hover:text-gold transition-colors duration-300">01 23 45 67 89</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gold/70 shrink-0" />
                <a href="mailto:contact@beindrive.com" className="hover:text-gold transition-colors duration-300">contact@beindrive.com</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/[0.06] relative z-10">
        <div className="container py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-primary-foreground/[0.15] text-xs">
            © {new Date().getFullYear()} BeInDrive · SIRET : XXX XXX XXX XXXXX · Tous droits réservés.
          </p>
          <div className="flex gap-6 text-xs text-primary-foreground/[0.15]">
            <a href="#" className="hover:text-gold transition-colors duration-300">Mentions légales</a>
            <a href="#" className="hover:text-gold transition-colors duration-300">CGV</a>
            <a href="#" className="hover:text-gold transition-colors duration-300">Confidentialité</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
