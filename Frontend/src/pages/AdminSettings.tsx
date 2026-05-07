import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { Loader2, Save, Globe, Shield, Settings as SettingsIcon, Bell } from "lucide-react";
import { useApp } from "@/context/AppContext";

const AdminSettings = () => {
  const queryClient = useQueryClient();
  const { refreshSettings } = useApp();
  const { data: settings, isLoading } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: adminApi.getSettings,
  });

  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const updateMutation = useMutation({
    mutationFn: adminApi.updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-settings"] });
      refreshSettings();
      toast({ title: "Settings Saved", description: "Application configurations updated successfully." });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  });

  if (isLoading || !formData) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleToggle = (key: string) => {
    setFormData({ ...formData, [key]: !formData[key] });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your application configurations and security preferences.</p>
      </div>

      <div className="grid gap-8">
        {/* Booking Rules */}
        <section className="rounded-[2.5rem] border border-border bg-card p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-2xl bg-primary/10 p-2 text-primary">
              <SettingsIcon className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold">Booking Rules</h3>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Default Currency</label>
              <select 
                name="currency" 
                value={formData.currency} 
                onChange={handleChange}
                className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Service Fee (%)</label>
              <input 
                type="number" 
                name="serviceFee" 
                value={formData.serviceFee} 
                onChange={handleChange}
                className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Tax Percentage (%)</label>
              <input 
                type="number" 
                name="tax" 
                value={formData.tax} 
                onChange={handleChange}
                className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Cancellation Policy</label>
              <input 
                name="cancellationPolicy" 
                value={formData.cancellationPolicy} 
                onChange={handleChange}
                className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20" 
              />
            </div>
          </div>
        </section>

        {/* System Controls */}
        <section className="rounded-[2.5rem] border border-border bg-card p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-2xl bg-orange-100 p-2 text-orange-600">
              <Shield className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold">System Controls</h3>
          </div>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold">Maintenance Mode</p>
                <p className="text-sm text-muted-foreground">Restrict access to the site during updates.</p>
              </div>
              <button 
                onClick={() => handleToggle('maintenanceMode')}
                className={`relative h-7 w-12 rounded-full transition-colors ${formData.maintenanceMode ? 'bg-primary' : 'bg-muted'}`}
              >
                <div className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${formData.maintenanceMode ? 'left-6' : 'left-1'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between border-t border-border pt-6">
              <div>
                <p className="font-bold">Bookings Enabled</p>
                <p className="text-sm text-muted-foreground">Allow or prevent users from making new reservations.</p>
              </div>
              <button 
                onClick={() => handleToggle('bookingEnabled')}
                className={`relative h-7 w-12 rounded-full transition-colors ${formData.bookingEnabled ? 'bg-primary' : 'bg-muted'}`}
              >
                <div className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${formData.bookingEnabled ? 'left-6' : 'left-1'}`} />
              </button>
            </div>
          </div>
        </section>

        <div className="flex justify-end pt-4">
          <button 
            onClick={() => updateMutation.mutate(formData)}
            disabled={updateMutation.isPending}
            className="flex items-center gap-2 rounded-2xl gradient-primary px-10 py-4 text-sm font-bold text-primary-foreground shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-70"
          >
            {updateMutation.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
