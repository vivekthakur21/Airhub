import { Plus, Search, MoreVertical, Edit, Trash2, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { HotelModal } from "@/components/HotelModal";

const AdminHotels = () => {
  const queryClient = useQueryClient();
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<any>(null);

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const data = await adminApi.getHotels() as any;
      // Handle both array and paginated object response
      setHotels(Array.isArray(data) ? data : data.listings || []);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this hotel?")) return;
    try {
      await adminApi.deleteHotel(id);
      queryClient.invalidateQueries({ queryKey: ["hotels"] });
      setHotels(hotels.filter((h) => h._id !== id));
      toast({ title: "Success", description: "Hotel deleted successfully" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const filteredHotels = hotels.filter((h) => 
    h.title.toLowerCase().includes(search.toLowerCase()) ||
    h.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 p-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Manage Hotels</h1>
          <p className="text-muted-foreground">Add, edit or remove property listings.</p>
        </div>
        <button 
          onClick={() => { setSelectedHotel(null); setIsModalOpen(true); }}
          className="flex items-center gap-2 rounded-2xl gradient-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-elegant transition-smooth hover:scale-105"
        >
          <Plus className="h-4 w-4" /> Add New Hotel
        </button>
      </header>

      <div className="rounded-3xl border border-border bg-card shadow-soft overflow-hidden">
        <div className="p-4 border-b border-border flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text"
              placeholder="Search by title or location..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-border bg-background outline-none focus:border-primary transition-smooth"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <table className="w-full text-left">
          <thead className="bg-muted/50 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-6 py-4">Property</th>
              <th className="px-6 py-4">Location</th>
              <th className="px-6 py-4">Price/Night</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-sm">
            {filteredHotels.map((hotel) => (
              <tr key={hotel._id} className="transition-smooth hover:bg-muted/30">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src={hotel.images?.[0]?.url || "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop"} 
                      className="h-10 w-10 rounded-lg object-cover border border-border"
                      alt={hotel.title}
                    />
                    <span className="font-semibold">{hotel.title}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-muted-foreground">{hotel.location}</td>
                <td className="px-6 py-4 font-bold text-primary">${hotel.price}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => { setSelectedHotel(hotel); setIsModalOpen(true); }}
                      className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-smooth"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(hotel._id)}
                      className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-smooth"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-smooth"><MoreVertical className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredHotels.length === 0 && !loading && (
              <tr>
                <td colSpan={4} className="px-6 py-20 text-center text-muted-foreground">
                  No hotels found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {isModalOpen && (
        <HotelModal 
          hotel={selectedHotel} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={fetchHotels} 
        />
      )}
    </div>
  );
};

export default AdminHotels;
