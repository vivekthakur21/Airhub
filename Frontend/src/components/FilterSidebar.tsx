import { categories } from "@/data/properties";
import { cn } from "@/lib/utils";
import { useApp } from "@/context/AppContext";

export interface Filters { type: string; maxPrice: number; location: string; }
interface Props { filters: Filters; onChange: (f: Filters) => void; onReset: () => void; }

export const FilterSidebar = ({ filters, onChange, onReset }: Props) => {
  const { settings } = useApp();
  return (
    <aside className="sticky top-28 h-fit space-y-6 rounded-3xl border border-border bg-card p-6 shadow-soft">
    <div className="flex items-center justify-between">
      <h3 className="font-display text-lg font-bold">Filters</h3>
      <button onClick={onReset} className="text-xs font-semibold text-primary underline-offset-4 hover:underline">Reset</button>
    </div>
    <div className="space-y-3">
      <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Location</p>
      <input value={filters.location} onChange={(e) => onChange({ ...filters, location: e.target.value })}
        placeholder="City or country"
        className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition-smooth focus:border-primary" />
    </div>
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Max price</p>
        <span className="text-sm font-semibold text-foreground">{settings?.currency === "INR" ? "₹" : settings?.currency === "EUR" ? "€" : "$"}{filters.maxPrice}</span>
      </div>
      <input type="range" min={50} max={800} step={10} value={filters.maxPrice}
        onChange={(e) => onChange({ ...filters, maxPrice: Number(e.target.value) })}
        className="w-full accent-[hsl(var(--primary))]" />
    </div>
    <div className="space-y-3">
      <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Property type</p>
      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <button key={c.id} onClick={() => onChange({ ...filters, type: c.id })}
            className={cn("rounded-full border px-3 py-1.5 text-xs font-medium transition-smooth",
              filters.type === c.id ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-foreground hover:border-foreground")}>
            {c.icon} {c.label}
          </button>
        ))}
      </div>
    </div>
  </aside>
);
};
