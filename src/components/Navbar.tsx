import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Menu, Moon, Search, Sun, User, Globe } from "lucide-react";
import { Logo } from "./Logo";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";

export const Navbar = () => {
  const { theme, toggleTheme, wishlist } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-transparent bg-background/70 backdrop-blur-xl transition-smooth",
        scrolled && "border-border shadow-soft bg-background/90"
      )}
    >
      <div className="container flex h-20 items-center justify-between gap-4">
        <Logo />

        <form
          onSubmit={onSearch}
          className="hidden md:flex items-center gap-2 rounded-full border border-border bg-card pl-5 pr-1.5 py-1.5 shadow-soft transition-smooth hover:shadow-card"
        >
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Anywhere · Any week · Add guests"
            className="w-72 bg-transparent text-sm font-medium outline-none placeholder:text-muted-foreground"
            aria-label="Search destinations"
          />
          <button
            type="submit"
            className="grid h-9 w-9 place-items-center rounded-full gradient-primary text-primary-foreground transition-smooth hover:scale-105"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </button>
        </form>

        <div className="flex items-center gap-1.5">
          <Link
            to="/auth"
            className="hidden lg:inline-flex rounded-full px-4 py-2 text-sm font-semibold text-foreground/80 transition-smooth hover:bg-muted"
          >
            Become a host
          </Link>
          <button
            onClick={toggleTheme}
            className="grid h-10 w-10 place-items-center rounded-full text-foreground/80 transition-smooth hover:bg-muted"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <Link
            to="/wishlist"
            className="relative grid h-10 w-10 place-items-center rounded-full text-foreground/80 transition-smooth hover:bg-muted"
            aria-label="Wishlist"
          >
            <Heart className="h-4 w-4" />
            {wishlist.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                {wishlist.length}
              </span>
            )}
          </Link>

          <div className="relative">
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="flex items-center gap-2 rounded-full border border-border bg-card px-2 py-1.5 transition-smooth hover:shadow-card"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
            >
              <Menu className="h-4 w-4" />
              <span className="grid h-7 w-7 place-items-center rounded-full bg-foreground text-background">
                <User className="h-4 w-4" />
              </span>
            </button>
            {menuOpen && (
              <div
                className="absolute right-0 mt-2 w-56 origin-top-right overflow-hidden rounded-2xl border border-border bg-popover p-1.5 shadow-card animate-scale-in"
                role="menu"
                onMouseLeave={() => setMenuOpen(false)}
              >
                {[
                  { to: "/auth", label: "Sign up", bold: true },
                  { to: "/auth", label: "Log in" },
                  { to: "/wishlist", label: "Wishlist" },
                  { to: "/auth", label: "Host your home" },
                  { to: "/", label: "Help center" },
                ].map((i, idx) => (
                  <Link
                    key={idx}
                    to={i.to}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      "block rounded-xl px-3 py-2 text-sm transition-smooth hover:bg-muted",
                      i.bold && "font-semibold"
                    )}
                  >
                    {i.label}
                  </Link>
                ))}
                <div className="mt-1 flex items-center gap-2 border-t border-border px-3 py-2 text-xs text-muted-foreground">
                  <Globe className="h-3.5 w-3.5" /> English (US) · USD
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <form onSubmit={onSearch} className="md:hidden container pb-3">
        <div className="flex items-center gap-2 rounded-full border border-border bg-card pl-4 pr-1 py-1 shadow-soft">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Where to?"
            className="flex-1 bg-transparent py-2 text-sm outline-none"
          />
          <button className="grid h-8 w-8 place-items-center rounded-full gradient-primary text-primary-foreground" aria-label="Search">
            <Search className="h-3.5 w-3.5" />
          </button>
        </div>
      </form>
    </header>
  );
};