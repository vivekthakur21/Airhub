import { Link } from "react-router-dom";
import { Hotel } from "lucide-react";

export const Logo = () => (
  <Link to="/" className="flex items-center gap-2 group" aria-label="Staybnb home">
    <span className="grid h-10 w-10 place-items-center rounded-xl bg-rose-500 text-white shadow-lg shadow-rose-500/20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
      <Hotel className="h-6 w-6" />
    </span>
    <span className="font-display text-2xl font-bold tracking-tight text-foreground">
      Wander<span className="text-rose-500">Lust</span>
    </span>
  </Link>
);