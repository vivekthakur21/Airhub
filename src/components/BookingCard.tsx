import { useMemo, useState } from "react";
import { Star } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Property } from "@/data/properties";

const Row = ({ label, value, bold }: { label: string; value: string; bold?: boolean }) => (
  <div className={"flex items-center justify-between " + (bold ? "font-bold text-foreground" : "text-muted-foreground")}>
    <span>{label}</span><span>{value}</span>
  </div>
);

export const BookingCard = ({ property }: { property: Property }) => {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 5;
    const ms = new Date(checkOut).getTime() - new Date(checkIn).getTime();
    return Math.max(1, Math.round(ms / 86400000));
  }, [checkIn, checkOut]);
  const subtotal = property.price * nights;
  const fee = Math.round(subtotal * 0.12);
  const total = subtotal + fee;

  return (
    <div className="sticky top-28 rounded-3xl border border-border bg-card p-6 shadow-elegant">
      <div className="flex items-baseline justify-between">
        <p className="text-foreground"><span className="text-2xl font-bold">\${property.price}</span><span className="text-muted-foreground"> night</span></p>
        <span className="flex items-center gap-1 text-sm">
          <Star className="h-3.5 w-3.5 fill-foreground" /> {property.rating}
          <span className="text-muted-foreground">· {property.reviews} reviews</span>
        </span>
      </div>
      <div className="mt-5 grid grid-cols-2 overflow-hidden rounded-2xl border border-border">
        <label className="border-r border-border p-3">
          <span className="block text-[10px] font-bold uppercase tracking-wide">Check-in</span>
          <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="mt-1 w-full bg-transparent text-sm outline-none" />
        </label>
        <label className="p-3">
          <span className="block text-[10px] font-bold uppercase tracking-wide">Checkout</span>
          <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="mt-1 w-full bg-transparent text-sm outline-none" />
        </label>
        <label className="col-span-2 border-t border-border p-3">
          <span className="block text-[10px] font-bold uppercase tracking-wide">Guests</span>
          <select value={guests} onChange={(e) => setGuests(Number(e.target.value))} className="mt-1 w-full bg-transparent text-sm outline-none">
            {Array.from({ length: property.guests }).map((_, i) => (
              <option key={i} value={i + 1}>{i + 1} guest{i ? "s" : ""}</option>
            ))}
          </select>
        </label>
      </div>
      <button onClick={() => toast({ title: "Reservation requested", description: `${nights} nights at ${property.title} for \$${total}` })}
        className="mt-4 w-full rounded-2xl gradient-primary py-3.5 text-sm font-bold text-primary-foreground transition-smooth hover:scale-[1.01] hover:shadow-elegant">
        Reserve
      </button>
      <p className="mt-2 text-center text-xs text-muted-foreground">You won't be charged yet</p>
      <div className="mt-5 space-y-2 text-sm">
        <Row label={`\$${property.price} × ${nights} nights`} value={`\$${subtotal}`} />
        <Row label="Service fee" value={`\$${fee}`} />
        <div className="my-3 border-t border-border" />
        <Row label="Total" value={`\$${total}`} bold />
      </div>
    </div>
  );
};
