import { categories } from "@/data/properties";
import { cn } from "@/lib/utils";

interface Props { active: string; onChange: (id: string) => void; }

export const CategoryBar = ({ active, onChange }: Props) => (
  <div className="sticky top-20 z-30 border-b border-border bg-background/80 backdrop-blur-xl">
    <div className="container flex gap-8 overflow-x-auto scrollbar-hide py-3">
      {categories.map((c) => (
        <button key={c.id} onClick={() => onChange(c.id)}
          className={cn("group flex shrink-0 flex-col items-center gap-1.5 border-b-2 pb-2 pt-1 text-xs font-medium transition-smooth",
            active === c.id ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:border-border hover:text-foreground")}>
          <span className="text-2xl transition-smooth group-hover:scale-110">{c.icon}</span>
          {c.label}
        </button>
      ))}
    </div>
  </div>
);
