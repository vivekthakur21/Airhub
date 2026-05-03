import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X, Upload, Loader2, Image as ImageIcon } from "lucide-react";
import { adminApi } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

interface HotelModalProps {
  hotel?: any;
  onClose: () => void;
  onSuccess?: () => void;
}

export const HotelModal = ({ hotel, onClose, onSuccess }: HotelModalProps) => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: hotel?.title || "",
    description: hotel?.description || "",
    price: hotel?.price || "",
    location: hotel?.location || "",
    guests: hotel?.guests || 2,
    category: hotel?.category || "Beachfront",
  });
  const categories = ['Beachfront', 'Cabins', 'Villas', 'Lofts', 'Countryside', 'Glamping', 'Ryokan'];
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>(hotel?.images?.map((img: any) => img.url) || []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      const fileArray = Array.from(selectedFiles);
      setFiles([...files, ...fileArray]);
      const newPreviews = fileArray.map(file => URL.createObjectURL(file));
      setPreviews([...previews, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setPreviews(prev => prev.filter((_, i) => i !== index));
    // If it's a newly added file, remove it from files array
    // We need to know which ones are new.
    // For simplicity, if index >= existing images count, it's new.
    const existingCount = hotel?.images?.length || 0;
    if (index >= existingCount) {
      setFiles(prev => prev.filter((_, i) => i !== (index - existingCount)));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value.toString());
    });
    
    files.forEach(file => {
      data.append("images", file);
    });

    try {
      if (hotel) {
        await adminApi.updateHotel(hotel._id, data);
        toast({ title: "Updated", description: "Hotel updated successfully" });
      } else {
        await adminApi.createHotel(data);
        toast({ title: "Created", description: "New hotel added successfully" });
      }
      queryClient.invalidateQueries({ queryKey: ["hotels"] });
      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl rounded-[2.5rem] border border-border bg-card p-8 shadow-2xl animate-in zoom-in-95 duration-300">
        <button onClick={onClose} className="absolute right-6 top-6 rounded-full p-2 hover:bg-muted transition-colors">
          <X className="h-5 w-5" />
        </button>

        <h2 className="font-display text-2xl font-bold mb-6">
          {hotel ? "Edit Property" : "Add New Property"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Property Title</label>
              <input 
                name="title" 
                value={formData.title} 
                onChange={handleChange} 
                required 
                className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Location</label>
              <input 
                name="location" 
                value={formData.location} 
                onChange={handleChange} 
                required 
                className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Price per night ($)</label>
              <input 
                type="number" 
                name="price" 
                value={formData.price} 
                onChange={handleChange} 
                required 
                className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Max Guests</label>
              <input 
                type="number" 
                name="guests" 
                value={formData.guests} 
                onChange={handleChange} 
                required 
                className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Category</label>
              <select 
                name="category" 
                value={formData.category} 
                onChange={handleChange} 
                required 
                className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Description</label>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              required 
              rows={3}
              className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 resize-none" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Images</label>
            <div className="grid grid-cols-4 gap-3">
              {previews.map((src, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-border group">
                  <img src={src} className="h-full w-full object-cover" />
                  <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 h-6 w-6 bg-rose-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <label className="aspect-square rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:bg-muted transition-colors">
                <Upload className="h-6 w-6 text-muted-foreground" />
                <span className="text-[10px] font-bold mt-1 uppercase text-muted-foreground">Upload</span>
                <input type="file" multiple className="hidden" onChange={handleImageChange} accept="image/*" />
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="rounded-2xl px-8 py-3 text-sm font-bold text-muted-foreground hover:bg-muted transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="flex items-center gap-2 rounded-2xl gradient-primary px-8 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-105 disabled:opacity-70">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (hotel ? "Save Changes" : "Create Property")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
