import { useEffect, useState } from "react";
import { Search, Calendar, User, Hotel, Trash2, Filter, Download } from "lucide-react";
import { adminApi } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const AdminBookings = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const data = await adminApi.getBookings();
      setBookings(data);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter((b) => 
    b.user?.name.toLowerCase().includes(search.toLowerCase()) ||
    b.listing?.title.toLowerCase().includes(search.toLowerCase())
  );

  const exportCSV = () => {
    const headers = ["Booking ID,User,Hotel,Check-in,Check-out,Price,Status\n"];
    const rows = filteredBookings.map(b => 
      `${b._id},${b.user?.name},${b.listing?.title},${b.checkIn},${b.checkOut},${b.totalPrice},${b.paymentStatus}`
    ).join("\n");
    
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bookings_export_${Date.now()}.csv`;
    a.click();
    toast({ title: "Success", description: "Exported CSV successfully" });
  };

  return (
    <div className="space-y-8 p-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Manage Bookings</h1>
          <p className="text-muted-foreground">Monitor and export all platform reservations.</p>
        </div>
        <div className="flex gap-3">
           <button 
             onClick={exportCSV}
             className="flex items-center gap-2 rounded-2xl border border-border bg-card px-6 py-3 text-sm font-bold transition-smooth hover:bg-muted"
           >
             <Download className="h-4 w-4" /> Export CSV
           </button>
        </div>
      </header>

      <div className="rounded-[2.5rem] border border-border bg-card shadow-soft overflow-hidden">
        <div className="p-4 border-b border-border flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text"
              placeholder="Search by user or hotel..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-border bg-background outline-none focus:border-primary transition-smooth"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl hover:bg-muted">
            <Filter className="h-4 w-4" /> Filter
          </button>
        </div>

        <table className="w-full text-left">
          <thead className="bg-muted/50 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Property</th>
              <th className="px-6 py-4">Stay Dates</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-sm">
            {filteredBookings.map((b) => (
              <tr key={b._id} className="transition-smooth hover:bg-muted/30">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-[10px]">
                      {b.user?.name[0]}
                    </div>
                    <span>{b.user?.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 font-medium">{b.listing?.title}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-col text-xs">
                    <span>{new Date(b.checkIn).toLocaleDateString()}</span>
                    <span className="text-muted-foreground">to {new Date(b.checkOut).toLocaleDateString()}</span>
                  </div>
                </td>
                <td className="px-6 py-4 font-bold text-primary">${b.totalPrice}</td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase",
                    b.paymentStatus === "paid" ? "bg-green-500/10 text-green-600" : "bg-amber-500/10 text-amber-600"
                  )}>
                    {b.paymentStatus}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 hover:bg-destructive/10 text-destructive rounded-lg">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminBookings;
