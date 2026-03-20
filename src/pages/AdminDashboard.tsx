import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, parseISO, startOfWeek, endOfWeek, addWeeks, eachDayOfInterval, isSameDay } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Calendar, Users, BarChart3, Plus, LogOut, ChevronLeft, ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = "planning" | "students" | "bookings";

const AdminDashboard = () => {
  const { user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<Tab>("planning");
  const [weekOffset, setWeekOffset] = useState(0);

  // Slot creation state
  const [newSlotDate, setNewSlotDate] = useState("");
  const [newSlotStart, setNewSlotStart] = useState("08:00");
  const [newSlotEnd, setNewSlotEnd] = useState("09:00");
  const [newSlotType, setNewSlotType] = useState("driving");
  const [showAddSlot, setShowAddSlot] = useState(false);

  const currentWeekStart = startOfWeek(addWeeks(new Date(), weekOffset), { weekStartsOn: 1 });
  const currentWeekEnd = endOfWeek(addWeeks(new Date(), weekOffset), { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: currentWeekStart, end: currentWeekEnd });

  // All slots
  const { data: allSlots = [] } = useQuery({
    queryKey: ["admin-slots"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("time_slots")
        .select("*")
        .order("start_time");
      if (error) throw error;
      return data;
    },
    enabled: isAdmin,
  });

  // All bookings with student info
  const { data: allBookings = [] } = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*, time_slots(*), profiles:student_id(full_name, email, phone)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: isAdmin,
  });

  // All students
  const { data: students = [] } = useQuery({
    queryKey: ["admin-students"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: isAdmin,
  });

  // Create slot
  const createSlot = useMutation({
    mutationFn: async () => {
      const startTime = new Date(`${newSlotDate}T${newSlotStart}:00`).toISOString();
      const endTime = new Date(`${newSlotDate}T${newSlotEnd}:00`).toISOString();
      const { error } = await supabase.from("time_slots").insert({
        start_time: startTime,
        end_time: endTime,
        slot_type: newSlotType,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Créneau créé !");
      queryClient.invalidateQueries({ queryKey: ["admin-slots"] });
      setShowAddSlot(false);
      setNewSlotDate("");
    },
    onError: (err: any) => toast.error(err.message),
  });

  // Update booking status
  const updateBookingStatus = useMutation({
    mutationFn: async ({ id, status, slotId }: { id: string; status: string; slotId?: string }) => {
      await supabase.from("bookings").update({ status }).eq("id", id);
      if (status === "cancelled" && slotId) {
        await supabase.from("time_slots").update({ is_available: true }).eq("id", slotId);
      }
    },
    onSuccess: () => {
      toast.success("Statut mis à jour");
      queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["admin-slots"] });
    },
  });

  // Delete slot
  const deleteSlot = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("time_slots").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Créneau supprimé");
      queryClient.invalidateQueries({ queryKey: ["admin-slots"] });
    },
    onError: (err: any) => toast.error(err.message),
  });

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">Accès refusé</h1>
          <p className="text-muted-foreground mb-4">Vous n'avez pas les droits administrateur.</p>
          <Button variant="gold" onClick={() => navigate("/")}>Retour à l'accueil</Button>
        </div>
      </div>
    );
  }

  const slotTypeLabel = (t: string) =>
    t === "driving" ? "🚗 Conduite" : t === "code" ? "📖 Code" : "📝 Examen";

  const tabs = [
    { id: "planning" as Tab, label: "Planning", icon: Calendar },
    { id: "bookings" as Tab, label: "Réservations", icon: BarChart3 },
    { id: "students" as Tab, label: "Élèves", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar-like header */}
      <header className="bg-charcoal text-primary-foreground">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="font-display text-xl font-bold">
              Bein<span className="text-gold">Drive</span>
              <span className="text-xs text-primary-foreground/40 ml-2 font-body">Admin</span>
            </span>
            <nav className="hidden md:flex items-center gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    activeTab === tab.id
                      ? "bg-gold/15 text-gold"
                      : "text-primary-foreground/60 hover:text-primary-foreground"
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="text-primary-foreground/60 hover:text-primary-foreground" onClick={() => navigate("/")}>
              <Home className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-primary-foreground/60 hover:text-primary-foreground" onClick={signOut}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
        {/* Mobile tabs */}
        <div className="md:hidden container pb-3 flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                activeTab === tab.id ? "bg-gold/15 text-gold" : "text-primary-foreground/60"
              )}
            >
              <tab.icon className="w-3 h-3" />
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <div className="container py-8">
        {/* PLANNING TAB */}
        {activeTab === "planning" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <button onClick={() => setWeekOffset(weekOffset - 1)} className="p-2 rounded-lg border border-border hover:bg-muted transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <h2 className="font-display text-xl font-bold text-foreground">
                  {format(currentWeekStart, "d MMM", { locale: fr })} – {format(currentWeekEnd, "d MMM yyyy", { locale: fr })}
                </h2>
                <button onClick={() => setWeekOffset(weekOffset + 1)} className="p-2 rounded-lg border border-border hover:bg-muted transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button onClick={() => setWeekOffset(0)} className="text-xs text-gold hover:text-gold-dark">Aujourd'hui</button>
              </div>
              <Button variant="gold" size="sm" onClick={() => setShowAddSlot(!showAddSlot)}>
                <Plus className="w-4 h-4 mr-1" /> Créneau
              </Button>
            </div>

            {/* Add slot form */}
            {showAddSlot && (
              <div className="bg-card rounded-xl border border-gold/20 p-5 mb-6 shadow-sm">
                <h3 className="font-semibold text-foreground mb-4">Nouveau créneau</h3>
                <div className="grid sm:grid-cols-5 gap-3 items-end">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Date</Label>
                    <Input type="date" value={newSlotDate} onChange={(e) => setNewSlotDate(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Début</Label>
                    <Input type="time" value={newSlotStart} onChange={(e) => setNewSlotStart(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Fin</Label>
                    <Input type="time" value={newSlotEnd} onChange={(e) => setNewSlotEnd(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Type</Label>
                    <Select value={newSlotType} onValueChange={setNewSlotType}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="driving">Conduite</SelectItem>
                        <SelectItem value="code">Code</SelectItem>
                        <SelectItem value="exam">Examen</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button variant="gold" onClick={() => createSlot.mutate()} disabled={!newSlotDate || createSlot.isPending}>
                    Ajouter
                  </Button>
                </div>
              </div>
            )}

            {/* Week grid */}
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((day) => {
                const daySlots = allSlots.filter((s) => isSameDay(parseISO(s.start_time), day));
                const dayBookings = allBookings.filter(
                  (b: any) => b.time_slots && isSameDay(parseISO(b.time_slots.start_time), day)
                );

                return (
                  <div key={day.toISOString()} className="bg-card rounded-lg border border-border p-3 min-h-[140px]">
                    <p className={cn(
                      "text-xs font-semibold mb-2 text-center",
                      isSameDay(day, new Date()) ? "text-gold" : "text-muted-foreground"
                    )}>
                      {format(day, "EEE d", { locale: fr })}
                    </p>
                    <div className="space-y-1">
                      {daySlots.map((slot) => {
                        const booking = dayBookings.find((b: any) => b.slot_id === slot.id);
                        return (
                          <div
                            key={slot.id}
                            className={cn(
                              "text-[10px] p-1.5 rounded leading-tight",
                              slot.is_available
                                ? "bg-gold/10 text-gold"
                                : "bg-charcoal/10 text-foreground"
                            )}
                          >
                            <p className="font-semibold">{format(parseISO(slot.start_time), "HH:mm")}</p>
                            <p>{slot.slot_type === "driving" ? "🚗" : slot.slot_type === "code" ? "📖" : "📝"}</p>
                            {booking && (
                              <p className="text-[9px] opacity-70 truncate">
                                {(booking as any).profiles?.full_name || "Élève"}
                              </p>
                            )}
                            {slot.is_available && (
                              <button
                                onClick={() => deleteSlot.mutate(slot.id)}
                                className="text-[9px] text-destructive hover:underline mt-0.5"
                              >
                                Suppr.
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* BOOKINGS TAB */}
        {activeTab === "bookings" && (
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground mb-6">Réservations</h2>
            {allBookings.length === 0 ? (
              <p className="text-muted-foreground">Aucune réservation pour le moment.</p>
            ) : (
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="text-left p-3 font-medium text-muted-foreground">Élève</th>
                        <th className="text-left p-3 font-medium text-muted-foreground">Date</th>
                        <th className="text-left p-3 font-medium text-muted-foreground">Type</th>
                        <th className="text-left p-3 font-medium text-muted-foreground">Statut</th>
                        <th className="text-left p-3 font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allBookings.map((b: any) => (
                        <tr key={b.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                          <td className="p-3">
                            <p className="font-medium text-foreground">{b.profiles?.full_name || "—"}</p>
                            <p className="text-xs text-muted-foreground">{b.profiles?.email}</p>
                          </td>
                          <td className="p-3 text-muted-foreground">
                            {b.time_slots ? format(parseISO(b.time_slots.start_time), "dd/MM/yyyy HH:mm") : "—"}
                          </td>
                          <td className="p-3">{b.time_slots ? slotTypeLabel(b.time_slots.slot_type) : "—"}</td>
                          <td className="p-3">
                            <span className={cn(
                              "text-xs font-medium px-2 py-1 rounded-full",
                              b.status === "confirmed" ? "bg-gold/10 text-gold" :
                              b.status === "completed" ? "bg-green-100 text-green-700" :
                              b.status === "cancelled" ? "bg-red-100 text-red-600" :
                              "bg-muted text-muted-foreground"
                            )}>
                              {b.status === "confirmed" ? "Confirmé" :
                               b.status === "completed" ? "Terminé" :
                               b.status === "cancelled" ? "Annulé" :
                               b.status === "no_show" ? "Absent" : b.status}
                            </span>
                          </td>
                          <td className="p-3">
                            {b.status === "confirmed" && (
                              <div className="flex gap-1">
                                <Button size="sm" variant="ghost" className="text-xs text-green-600"
                                  onClick={() => updateBookingStatus.mutate({ id: b.id, status: "completed" })}>
                                  ✓ Terminé
                                </Button>
                                <Button size="sm" variant="ghost" className="text-xs text-destructive"
                                  onClick={() => updateBookingStatus.mutate({ id: b.id, status: "no_show", slotId: b.slot_id })}>
                                  Absent
                                </Button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STUDENTS TAB */}
        {activeTab === "students" && (
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground mb-6">
              Élèves ({students.length})
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {students.map((s) => {
                const studentBookings = allBookings.filter((b: any) => b.student_id === s.user_id);
                const completed = studentBookings.filter((b: any) => b.status === "completed").length;
                const totalHours = completed; // 1 booking ≈ 1h

                return (
                  <div key={s.id} className="bg-card rounded-xl border border-border p-5 hover:border-gold/20 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center font-bold text-gold text-sm">
                        {s.full_name?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{s.full_name || "Sans nom"}</p>
                        <p className="text-xs text-muted-foreground">{s.email}</p>
                      </div>
                    </div>
                    {s.phone && <p className="text-xs text-muted-foreground mb-2">📞 {s.phone}</p>}
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span>{studentBookings.length} réservations</span>
                      <span>{totalHours}h effectuées</span>
                    </div>
                  </div>
                );
              })}
              {students.length === 0 && (
                <p className="text-muted-foreground col-span-full">Aucun élève inscrit pour le moment.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
