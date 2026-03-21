import { MapPin, Phone, Mail, Clock, Shield, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer id="contact" className="bg-charcoal text-primary-foreground border-t border-primary-foreground/10">
      <div className="container py-16 lg:py-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <span className="font-display text-2xl font-bold tracking-tight mb-4 block">
              Bein<span className="text-gold">Drive</span>
            </span>
            <p className="text-primary-foreground/50 text-sm leading-relaxed max-w-xs mb-5">
              Auto-école agréée par la Préfecture. Formation au code de la route et à la conduite 
              avec un enseignant titulaire du Titre Professionnel ECSR.
            </p>
            <div className="flex items-start gap-2 text-xs text-primary-foreground/30">
              <Shield className="w-3.5 h-3.5 text-gold/50 mt-0.5 shrink-0" />
              <span>Agrément préfectoral n° E XX XXX XXXX X</span>
            </div>
          </div>

          {/* Formations */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-5">Formations</h4>
            <ul className="space-y-2.5 text-sm text-primary-foreground/60">
              <li><a href="#services" className="hover:text-gold transition-colors">Code de la route (ETG)</a></li>
              <li><a href="#services" className="hover:text-gold transition-colors">Permis B – Boîte manuelle</a></li>
              <li><a href="#services" className="hover:text-gold transition-colors">Permis B – Boîte automatique (BEA)</a></li>
              <li><a href="#services" className="hover:text-gold transition-colors">Conduite Accompagnée (AAC)</a></li>
              <li><a href="#services" className="hover:text-gold transition-colors">Conduite Supervisée</a></li>
              <li><a href="#services" className="hover:text-gold transition-colors">Perfectionnement</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-5">Contact</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/60">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                <span>12 Rue de la République<br />75001 Paris</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gold shrink-0" />
                <a href="tel:+33123456789" className="hover:text-gold transition-colors">01 23 45 67 89</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gold shrink-0" />
                <a href="mailto:contact@beindrive.com" className="hover:text-gold transition-colors">contact@beindrive.com</a>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-5">Horaires d'ouverture</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/60">
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                <div>
                  <p>Lun – Ven : 8h00 – 19h00</p>
                  <p>Samedi : 9h00 – 17h00</p>
                  <p className="text-primary-foreground/30">Dimanche : Fermé</p>
                </div>
              </li>
            </ul>
            <div className="mt-5">
              <button
                onClick={() => navigate("/booking")}
                className="text-sm text-gold hover:text-gold-light transition-colors font-medium flex items-center gap-1.5"
              >
                Réserver en ligne <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10">
        <div className="container py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-primary-foreground/30 text-xs">
            © {new Date().getFullYear()} BeinDrive · SIRET : XXX XXX XXX XXXXX · Tous droits réservés.
          </p>
          <div className="flex gap-6 text-xs text-primary-foreground/30">
            <a href="#" className="hover:text-gold transition-colors">Mentions légales</a>
            <a href="#" className="hover:text-gold transition-colors">CGV</a>
            <a href="#" className="hover:text-gold transition-colors">Politique de confidentialité</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
