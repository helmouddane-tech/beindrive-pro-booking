import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format, isSameDay, parseISO, startOfDay } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import { Car, BookOpen, FileCheck, Clock, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const slotTypeLabels: Record<string, { label: string; icon: typeof Car }> = {
  driving: { label: "Conduite", icon: Car },
  code: { label: "Code", icon: BookOpen },
  exam: { label: "Examen", icon: FileCheck },
};

const BookingPage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Fetch available slots
  const { data: slots = [], isLoading: slotsLoading } = useQuery({
    queryKey: ["available-slots"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("time_slots")
        .select("*")
        .eq("is_available", true)
        .gte("start_time", new Date().toISOString())
        .order("start_time");
      if (error) throw error;
      return data;
    },
  });

  // Fetch user's bookings
  const { data: myBookings = [] } = useQuery({
    queryKey: ["my-bookings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*, time_slots(*)")
        .eq("student_id", user!.id)
        .neq("status", "cancelled")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const bookSlot = useMutation({
    mutationFn: async (slotId: string) => {
      const { error: bookingError } = await supabase
        .from("bookings")
        .insert({ student_id: user!.id, slot_id: slotId });
      if (bookingError) throw bookingError;

      const { error: slotError } = await supabase
        .from("time_slots")
        .update({ is_available: false })
        .eq("id", slotId);
      if (slotError) throw slotError;
    },
    onSuccess: () => {
      toast.success("Créneau réservé avec succès !");
      queryClient.invalidateQueries({ queryKey: ["available-slots"] });
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
    },
    onError: (err: any) => toast.error(err.message),
  });

  const cancelBooking = useMutation({
    mutationFn: async ({ bookingId, slotId }: { bookingId: string; slotId: string }) => {
      await supabase.from("bookings").update({ status: "cancelled" }).eq("id", bookingId);
      await supabase.from("time_slots").update({ is_available: true }).eq("id", slotId);
    },
    onSuccess: () => {
      toast.success("Réservation annulée");
      queryClient.invalidateQueries({ queryKey: ["available-slots"] });
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
    },
  });

  const filteredSlots = selectedDate
    ? slots.filter((s) => isSameDay(parseISO(s.start_time), selectedDate))
    : [];

  // Dates that have available slots
  const datesWithSlots = slots.map((s) => startOfDay(parseISO(s.start_time)));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-charcoal text-primary-foreground py-6">
        <div className="container flex items-center justify-between">
          <a href="/" className="font-display text-2xl font-bold">
            Bein<span className="text-gold">Drive</span>
          </a>
          <div className="flex items-center gap-4">
            <span className="text-sm text-primary-foreground/60 hidden sm:block">
              {user?.email}
            </span>
            <Button variant="gold" size="sm" onClick={() => window.location.href = "/dashboard"}>
              Mes réservations
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-10">
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">
          Réserver un créneau
        </h1>
        <p className="text-muted-foreground mb-8">
          Sélectionnez une date puis choisissez un créneau disponible.
        </p>

        <div className="grid lg:grid-cols-[350px_1fr] gap-8">
          {/* Calendar */}
          <div className="bg-card rounded-xl border border-border p-5 shadow-sm h-fit">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              locale={fr}
              className="pointer-events-auto"
              modifiers={{ hasSlot: datesWithSlots }}
              modifiersClassNames={{ hasSlot: "bg-gold/15 text-gold font-semibold" }}
              disabled={(date) => date < startOfDay(new Date())}
            />
          </div>

          {/* Slots */}
          <div>
            {selectedDate && (
              <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                {format(selectedDate, "EEEE d MMMM yyyy", { locale: fr })}
              </h2>
            )}

            {slotsLoading ? (
              <p className="text-muted-foreground">Chargement...</p>
            ) : filteredSlots.length === 0 ? (
              <div className="bg-card rounded-xl border border-border p-8 text-center">
                <Clock className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">Aucun créneau disponible pour cette date.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-3">
                {filteredSlots.map((slot) => {
                  const typeInfo = slotTypeLabels[slot.slot_type] || slotTypeLabels.driving;
                  const Icon = typeInfo.icon;
                  const isBooked = myBookings.some((b) => b.slot_id === slot.id);

                  return (
                    <div
                      key={slot.id}
                      className="bg-card rounded-lg border border-border p-4 flex items-center justify-between hover:border-gold/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-gold" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground text-sm">{typeInfo.label}</p>
                          <p className="text-muted-foreground text-xs">
                            {format(parseISO(slot.start_time), "HH:mm")} – {format(parseISO(slot.end_time), "HH:mm")}
                          </p>
                        </div>
                      </div>
                      {isBooked ? (
                        <span className="text-xs text-gold flex items-center gap-1">
                          <Check className="w-3 h-3" /> Réservé
                        </span>
                      ) : (
                        <Button
                          variant="gold"
                          size="sm"
                          onClick={() => bookSlot.mutate(slot.id)}
                          disabled={bookSlot.isPending}
                        >
                          Réserver
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* My bookings */}
        {myBookings.length > 0 && (
          <div className="mt-12">
            <h2 className="font-display text-2xl font-bold text-foreground mb-4">
              Mes réservations
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {myBookings.map((booking: any) => {
                const slot = booking.time_slots;
                if (!slot) return null;
                const typeInfo = slotTypeLabels[slot.slot_type] || slotTypeLabels.driving;
                const Icon = typeInfo.icon;

                return (
                  <div
                    key={booking.id}
                    className={cn(
                      "bg-card rounded-lg border p-4",
                      booking.status === "confirmed" ? "border-gold/30" : "border-border opacity-60"
                    )}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-lg bg-gold/10 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-gold" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm">{typeInfo.label}</p>
                        <p className="text-muted-foreground text-xs">
                          {format(parseISO(slot.start_time), "EEEE d MMM – HH:mm", { locale: fr })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={cn(
                        "text-xs font-medium px-2 py-1 rounded-full",
                        booking.status === "confirmed" ? "bg-gold/10 text-gold" :
                        booking.status === "completed" ? "bg-green-100 text-green-700" :
                        "bg-muted text-muted-foreground"
                      )}>
                        {booking.status === "confirmed" ? "Confirmé" :
                         booking.status === "completed" ? "Terminé" :
                         booking.status === "cancelled" ? "Annulé" : booking.status}
                      </span>
                      {booking.status === "confirmed" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive text-xs"
                          onClick={() => cancelBooking.mutate({ bookingId: booking.id, slotId: slot.id })}
                        >
                          Annuler
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingPage;
