import { Link } from "react-router-dom";

export const Logo = () => (
  <Link to="/" className="flex items-center gap-2 group" aria-label="Staybnb home">
    <span className="grid h-9 w-9 place-items-center rounded-xl gradient-primary text-primary-foreground shadow-elegant transition-smooth group-hover:scale-105">
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
        <path d="M12 2C7.5 8 4 11.5 4 15.5A8 8 0 0 0 20 15.5C20 11.5 16.5 8 12 2Z" />
      </svg>
    </span>
    <span className="font-display text-xl font-extrabold tracking-tight text-foreground">
      Wander<span className="text-primary">lust</span>
    </span>
  </Link>
);