import { Link } from "react-router-dom";
import { Globe, Instagram, Twitter, Facebook } from "lucide-react";

const sections = [
  { title: "Support", links: ["Help Center", "Safety information", "Cancellation options", "Report a concern"] },
  { title: "Community", links: ["Disaster relief", "Combating discrimination", "Refer a host", "Gift cards"] },
  { title: "Hosting", links: ["Try hosting", "Protection for hosts", "Explore resources", "Visit forum"] },
  { title: "Staybnb", links: ["Newsroom", "New features", "Careers", "Investors"] },
];

export const Footer = () => (
  <footer className="mt-24 border-t border-border bg-muted/40">
    <div className="container grid gap-10 py-14 md:grid-cols-4">
      {sections.map((s) => (
        <div key={s.title}>
          <h4 className="mb-4 text-sm font-bold text-foreground">{s.title}</h4>
          <ul className="space-y-2">
            {s.links.map((l) => (
              <li key={l}>
                <Link to="/" className="text-sm text-muted-foreground transition-smooth hover:text-foreground">
                  {l}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
    <div className="border-t border-border">
      <div className="container flex flex-col items-center justify-between gap-4 py-6 md:flex-row">
        <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Staybnb · Privacy · Terms · Sitemap</p>
        <div className="flex items-center gap-4 text-muted-foreground">
          <button className="flex items-center gap-1.5 text-sm font-medium text-foreground transition-smooth hover:text-primary">
            <Globe className="h-4 w-4" /> English (US)
          </button>
          <span className="text-sm font-medium text-foreground">$ USD</span>
          <a href="#" aria-label="Instagram" className="transition-smooth hover:text-primary"><Instagram className="h-4 w-4" /></a>
          <a href="#" aria-label="Twitter" className="transition-smooth hover:text-primary"><Twitter className="h-4 w-4" /></a>
          <a href="#" aria-label="Facebook" className="transition-smooth hover:text-primary"><Facebook className="h-4 w-4" /></a>
        </div>
      </div>
    </div>
  </footer>
);