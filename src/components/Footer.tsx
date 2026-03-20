import { MapPin, Phone, Mail, Clock } from "lucide-react";

const Footer = () => {
  return (
    <footer id="contact" className="bg-charcoal text-primary-foreground border-t border-primary-foreground/10">
      <div className="container py-16 lg:py-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <span className="font-display text-2xl font-bold tracking-tight mb-4 block">
              Bein<span className="text-gold">Drive</span>
            </span>
            <p className="text-primary-foreground/50 text-sm leading-relaxed max-w-xs">
              Auto-école premium. Formation au code de la route et à la conduite 
              avec un enseignant diplômé d'État.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-5">Contact</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/60">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                <span>12 Rue de la République, 75001 Paris</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gold shrink-0" />
                <span>01 23 45 67 89</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gold shrink-0" />
                <span>contact@beindrive.com</span>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-5">Horaires</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/60">
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                <div>
                  <p>Lundi – Vendredi : 8h – 19h</p>
                  <p>Samedi : 9h – 17h</p>
                  <p>Dimanche : Fermé</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10">
        <div className="container py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-primary-foreground/30 text-xs">
            © {new Date().getFullYear()} BeinDrive. Tous droits réservés.
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
