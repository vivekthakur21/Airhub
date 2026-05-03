import { useMemo, useState } from "react";
import { Star, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { Property } from "@/data/properties";
import { useApp } from "@/context/AppContext";
import { paymentApi } from "@/lib/api";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Row = ({ label, value, bold }: { label: string; value: string; bold?: boolean }) => (
  <div className={"flex items-center justify-between " + (bold ? "font-bold text-foreground" : "text-muted-foreground")}>
    <span>{label}</span><span>{value}</span>
  </div>
);

export const BookingCard = ({ property }: { property: Property }) => {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [isBooking, setIsBooking] = useState(false);
  const { user } = useApp();
  const navigate = useNavigate();

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 1;
    const ms = new Date(checkOut).getTime() - new Date(checkIn).getTime();
    return Math.max(1, Math.round(ms / 86400000));
  }, [checkIn, checkOut]);

  const subtotal = property.price * nights;
  const fee = Math.round(subtotal * 0.12);
  const total = subtotal + fee;

  const handleReserve = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to book this property.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (!checkIn || !checkOut) {
      toast({
        title: "Missing Dates",
        description: "Please select check-in and checkout dates.",
        variant: "destructive",
      });
      return;
    }

    setIsBooking(true);

    try {
      const propId = property._id || property.id;
      // 1. Create Order on Backend
      const order = await paymentApi.createOrder(total, propId, checkIn, checkOut);

      // 2. Open Razorpay Checkout
      const options = {
        key: "rzp_test_Sl1A6HQsDyb5sI", 
        amount: order.amount,
        currency: order.currency,
        name: "Cozy Finds",
        description: `Booking for ${property.title}`,
        order_id: order.id,
        handler: async (response: any) => {
          try {
            // 3. Verify Payment on Backend
            const result = await paymentApi.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingData: {
                listingId: propId,
                checkIn,
                checkOut,
                totalPrice: total,
              },
            });

            if (result.success) {
              toast({
                title: "Booking Successful! 🎉",
                description: `Your stay at ${property.title} is confirmed.`,
              });
              navigate("/bookings"); // We'll create this page next
            }
          } catch (err: any) {
            toast({
              title: "Verification Failed",
              description: err.message || "Could not verify payment.",
              variant: "destructive",
            });
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: "#F43F5E", // Rose-500
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        toast({
          title: "Payment Failed",
          description: response.error.description,
          variant: "destructive",
        });
      });
      rzp.open();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="sticky top-28 rounded-3xl border border-border bg-card p-6 shadow-elegant">
      <div className="flex items-baseline justify-between">
        <p className="text-foreground"><span className="text-2xl font-bold">${property.price}</span><span className="text-muted-foreground"> night</span></p>
        <span className="flex items-center gap-1 text-sm">
          <Star className="h-3.5 w-3.5 fill-foreground" /> {property.rating}
          <span className="text-muted-foreground">· {property.reviews} reviews</span>
        </span>
      </div>
      <div className="mt-5 grid grid-cols-2 overflow-hidden rounded-2xl border border-border">
        <label className="border-r border-border p-3">
          <span className="block text-[10px] font-bold uppercase tracking-wide">Check-in</span>
          <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="mt-1 w-full bg-transparent text-sm outline-none" min={new Date().toISOString().split('T')[0]} />
        </label>
        <label className="p-3">
          <span className="block text-[10px] font-bold uppercase tracking-wide">Checkout</span>
          <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="mt-1 w-full bg-transparent text-sm outline-none" min={checkIn || new Date().toISOString().split('T')[0]} />
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
      <button 
        onClick={handleReserve}
        disabled={isBooking}
        className="mt-4 w-full flex items-center justify-center gap-2 rounded-2xl gradient-primary py-3.5 text-sm font-bold text-primary-foreground transition-smooth hover:scale-[1.01] hover:shadow-elegant disabled:opacity-70"
      >
        {isBooking ? <Loader2 className="h-4 w-4 animate-spin" /> : "Reserve"}
      </button>
      <p className="mt-2 text-center text-xs text-muted-foreground">You won't be charged yet</p>
      <div className="mt-5 space-y-2 text-sm">
        <Row label={`$${property.price} × ${nights} nights`} value={`$${subtotal}`} />
        <Row label="Service fee" value={`$${fee}`} />
        <div className="my-3 border-t border-border" />
        <Row label="Total" value={`$${total}`} bold />
      </div>
    </div>
  );
};
