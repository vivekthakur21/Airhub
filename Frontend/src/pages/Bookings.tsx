import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Trash2, Loader2 } from "lucide-react";
import { bookingApi } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { useApp } from "@/context/AppContext";

const Bookings = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useApp();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await bookingApi.getUserBookings();
        setBookings(data);
      } catch (err) {
        console.error("Failed to fetch bookings", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchBookings();
    }
  }, [user]);

  const cancelBooking = async (id: string) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      await bookingApi.deleteBooking(id);
      setBookings(bookings.filter((b) => b._id !== id));
      toast({
        title: "Booking cancelled",
        description: "Your reservation has been removed.",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Could not cancel booking.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container py-20 text-center">
        <h1 className="font-display text-3xl font-bold">Please log in to view bookings</h1>
        <Link to="/auth" className="mt-4 inline-block text-primary underline">Go to Login</Link>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <h1 className="font-display text-3xl font-bold mb-8">My Bookings</h1>
      
      {bookings.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border p-12 text-center">
          <p className="text-muted-foreground">You don't have any bookings yet.</p>
          <Link to="/" className="mt-4 inline-block rounded-full bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground transition-smooth hover:scale-105">
            Explore properties
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {bookings.map((booking) => (
            <div key={booking._id} className="overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition-smooth hover:shadow-card">
              <img 
                src={booking.listing.images[0]} 
                alt={booking.listing.title} 
                className="h-48 w-full object-cover"
              />
              <div className="p-5">
                <h3 className="font-display text-lg font-bold truncate">{booking.listing.title}</h3>
                <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  {booking.listing.location}
                </div>
                
                <div className="mt-4 space-y-2 border-t border-border pt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Calendar className="h-4 w-4" /> Check-in
                    </span>
                    <span className="font-medium">{new Date(booking.checkIn).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Calendar className="h-4 w-4" /> Checkout
                    </span>
                    <span className="font-medium">{new Date(booking.checkOut).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Total Price</p>
                    <p className="text-lg font-bold">${booking.totalPrice}</p>
                  </div>
                  <button 
                    onClick={() => cancelBooking(booking._id)}
                    className="grid h-10 w-10 place-items-center rounded-full border border-border text-muted-foreground transition-smooth hover:bg-destructive/10 hover:text-destructive"
                    title="Cancel Booking"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="mt-3">
                   <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-green-700">
                     {booking.paymentStatus}
                   </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookings;
