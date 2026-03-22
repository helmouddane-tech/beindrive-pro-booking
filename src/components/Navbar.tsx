import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "Formations", href: "#services" },
    { label: "Pourquoi nous", href: "#why" },
    { label: "Vidéos & News", href: "#media" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-[400ms] ease-in-out ${
        scrolled
          ? "bg-charcoal/[0.97] backdrop-blur-[16px] shadow-xl border-b border-white/[0.07] py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container flex items-center justify-between">
        <a href="#" className="flex items-center">
          <span className="font-display text-2xl font-[800] text-primary-foreground tracking-[-1.5px]">
            Be<span className="text-gold">[In]</span>Drive
          </span>
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-primary-foreground/60 hover:text-gold text-[13px] font-medium tracking-wide uppercase transition-colors duration-200"
            >
              {l.label}
            </a>
          ))}
          <Button variant="gold" size="default" onClick={() => navigate(user ? "/booking" : "/auth")}>
            {user ? "Mon espace" : "Réserver"}
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-primary-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-charcoal/[0.98] backdrop-blur-[16px] border-t border-white/[0.07] mt-2">
          <div className="container py-6 flex flex-col gap-4">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="text-primary-foreground/60 hover:text-gold text-sm font-medium tracking-wide uppercase py-2 transition-colors duration-200"
              >
                {l.label}
              </a>
            ))}
            <Button variant="gold" size="lg" className="mt-2" onClick={() => { setMobileOpen(false); navigate(user ? "/booking" : "/auth"); }}>
              Réserver
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
