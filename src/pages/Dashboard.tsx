import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar, User, LogOut, Home, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

const Dashboard = () => {
  const { user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user!.id)
        .single();
      return data;
    },
    enabled: !!user,
  });

  const { data: bookings = [] } = useQuery({
    queryKey: ["dashboard-bookings", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("bookings")
        .select("*, time_slots(*)")
        .eq("student_id", user!.id)
        .order("created_at", { ascending: false });
      return data || [];
    },
    enabled: !!user,
  });

  const upcoming = bookings.filter(
    (b: any) => b.status === "confirmed" && b.time_slots && new Date(b.time_slots.start_time) > new Date()
  );
  const completed = bookings.filter((b: any) => b.status === "completed");

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-charcoal text-primary-foreground py-4">
        <div className="container flex items-center justify-between">
          <a href="/" className="font-display text-xl font-bold">
            Bein<span className="text-gold">Drive</span>
          </a>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <Button variant="ghost" size="sm" className="text-gold" onClick={() => navigate("/admin")}>
                Admin
              </Button>
            )}
            <Button variant="ghost" size="sm" className="text-primary-foreground/60" onClick={() => navigate("/")}>
              <Home className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-primary-foreground/60" onClick={signOut}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground mb-1">
            Bonjour{profile?.full_name ? `, ${profile.full_name}` : ""} 👋
          </h1>
          <p className="text-muted-foreground">Votre espace élève BeinDrive</p>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-5 h-5 text-gold" />
              <span className="text-sm font-medium text-muted-foreground">À venir</span>
            </div>
            <p className="font-display text-3xl font-bold text-foreground">{upcoming.length}</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="w-5 h-5 text-gold" />
              <span className="text-sm font-medium text-muted-foreground">Leçons effectuées</span>
            </div>
            <p className="font-display text-3xl font-bold text-foreground">{completed.length}</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center gap-3 mb-2">
              <User className="w-5 h-5 text-gold" />
              <span className="text-sm font-medium text-muted-foreground">Heures de conduite</span>
            </div>
            <p className="font-display text-3xl font-bold text-foreground">{completed.length}h</p>
          </div>
        </div>

        {/* Quick action */}
        <Button variant="gold" size="lg" className="mb-8" onClick={() => navigate("/booking")}>
          <Calendar className="w-4 h-4 mr-2" /> Réserver un créneau
        </Button>

        {/* Upcoming */}
        <h2 className="font-display text-xl font-bold text-foreground mb-4">Prochaines leçons</h2>
        {upcoming.length === 0 ? (
          <p className="text-muted-foreground text-sm">Aucune leçon à venir. Réservez votre prochain créneau !</p>
        ) : (
          <div className="space-y-3">
            {upcoming.map((b: any) => (
              <div key={b.id} className="bg-card rounded-lg border border-gold/20 p-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground">
                    {b.time_slots?.slot_type === "driving" ? "🚗 Conduite" :
                     b.time_slots?.slot_type === "code" ? "📖 Code" : "📝 Examen"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {b.time_slots && format(parseISO(b.time_slots.start_time), "EEEE d MMMM à HH:mm", { locale: fr })}
                  </p>
                </div>
                <span className="bg-gold/10 text-gold text-xs font-medium px-3 py-1 rounded-full">Confirmé</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
