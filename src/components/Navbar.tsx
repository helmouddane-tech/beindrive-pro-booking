import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/logo-beindrive.png";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "Formations", href: "#services" },
    { label: "Pourquoi nous", href: "#why" },
    { label: "Médias", href: "#media" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
        scrolled
          ? "bg-charcoal/95 backdrop-blur-xl shadow-xl border-b border-white/[0.06] py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center group">
          <img src={logo} alt="BeInDrive" className="h-10 w-auto object-contain" />
        </a>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-10">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-primary-foreground/50 hover:text-primary-foreground text-[13px] font-medium tracking-wide transition-colors duration-200"
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center gap-4">
          <a href="tel:+33123456789" className="flex items-center gap-2 text-primary-foreground/40 hover:text-gold text-sm transition-colors duration-200">
            <Phone className="w-3.5 h-3.5" />
            <span className="font-medium">01 23 45 67 89</span>
          </a>
          <Button variant="gold" size="default" onClick={() => navigate(user ? "/dashboard" : "/auth")}>
            {user ? "Mon espace" : "Réserver"}
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden text-primary-foreground p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <AnimatePresence mode="wait">
            {mobileOpen ? (
              <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <X size={22} />
              </motion.div>
            ) : (
              <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <Menu size={22} />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden overflow-hidden bg-charcoal/98 backdrop-blur-xl border-t border-white/[0.06]"
          >
            <div className="container py-8 flex flex-col gap-4">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-primary-foreground/50 hover:text-primary-foreground text-sm font-medium py-2 transition-colors duration-200"
                >
                  {l.label}
                </a>
              ))}
              <Button variant="gold" size="lg" className="mt-4" onClick={() => { setMobileOpen(false); navigate(user ? "/dashboard" : "/auth"); }}>
                {user ? "Mon espace" : "Réserver maintenant"}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
