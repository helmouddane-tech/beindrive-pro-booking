import { MapPin, Phone, Mail, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer id="contact" className="bg-charcoal text-primary-foreground border-t-[3px] border-t-gold">
      <div className="container py-16 lg:py-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <span className="font-display font-[800] text-2xl tracking-[-1.5px] mb-4 block">
              Be<span className="text-gold">[In]</span>Drive
            </span>
            <p className="text-primary-foreground/[0.45] text-sm leading-relaxed max-w-xs mb-5">
              Auto-école agréée par la Préfecture. Formation au code de la route et à la conduite
              avec un enseignant titulaire du Titre Professionnel ECSR.
            </p>
            <div className="flex items-start gap-2 text-xs text-primary-foreground/[0.2]">
              <Shield className="w-3.5 h-3.5 text-gold/50 mt-0.5 shrink-0" />
              <span>Agrément préfectoral n° E XX XXX XXXX X</span>
            </div>
            {/* Social icons placeholder */}
            <div className="flex gap-3 mt-5">
              {["Facebook", "Instagram", "TikTok"].map((s) => (
                <a key={s} href="#" className="w-8 h-8 rounded-md bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-primary-foreground/40 hover:text-gold hover:border-gold/30 transition-colors duration-200 text-[10px] font-bold">
                  {s[0]}
                </a>
              ))}
            </div>
          </div>

          {/* Formations */}
          <div>
            <h4 className="font-display font-[800] text-lg mb-5 tracking-[-0.5px]">Formations</h4>
            <ul className="space-y-2.5 text-sm text-primary-foreground/[0.45]">
              <li><a href="#services" className="hover:text-gold transition-colors duration-200">Code de la route (ETG)</a></li>
              <li><a href="#services" className="hover:text-gold transition-colors duration-200">Permis B — Boîte manuelle</a></li>
              <li><a href="#services" className="hover:text-gold transition-colors duration-200">Conduite Accompagnée (AAC)</a></li>
              <li><a href="#services" className="hover:text-gold transition-colors duration-200">Perfectionnement</a></li>
            </ul>
          </div>

          {/* Informations */}
          <div>
            <h4 className="font-display font-[800] text-lg mb-5 tracking-[-0.5px]">Informations</h4>
            <ul className="space-y-2.5 text-sm text-primary-foreground/[0.45]">
              <li><a href="#why" className="hover:text-gold transition-colors duration-200">À propos</a></li>
              <li><a href="#media" className="hover:text-gold transition-colors duration-200">Vidéos & News</a></li>
              <li><a href="#" className="hover:text-gold transition-colors duration-200">Mentions légales</a></li>
              <li><a href="#" className="hover:text-gold transition-colors duration-200">CGV</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-[800] text-lg mb-5 tracking-[-0.5px]">Contact</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/[0.45]">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                <span>12 Rue de la République<br />75001 Paris</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gold shrink-0" />
                <a href="tel:+33123456789" className="hover:text-gold transition-colors duration-200">01 23 45 67 89</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gold shrink-0" />
                <a href="mailto:contact@beindrive.com" className="hover:text-gold transition-colors duration-200">contact@beindrive.com</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/[0.08]">
        <div className="container py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-primary-foreground/[0.2] text-xs">
            © {new Date().getFullYear()} BeInDrive · SIRET : XXX XXX XXX XXXXX · Tous droits réservés.
          </p>
          <div className="flex gap-6 text-xs text-primary-foreground/[0.2]">
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
