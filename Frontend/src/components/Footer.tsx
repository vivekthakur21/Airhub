import { Link } from "react-router-dom";
import {
  Instagram,
  Twitter,
  Facebook,
  Phone as WhatsApp,
  Hotel
} from "lucide-react";
import { useApp } from "@/context/AppContext";

// Footer Link configuration
const FOOTER_CONFIG = {
  explore: [
    { label: "Browse Hotels", path: "/search" },
    { label: "Top Destinations", path: "/destinations" },
    { label: "Offers", path: "/offers" },
    { label: "Travel Guide", path: "/guide" },
  ],
  company: [
    { label: "About Us", path: "/about" },
    { label: "Contact Us", path: "/contact" },
    { label: "Blog", path: "/blog" },
  ],
  support: [
    { label: "Help Center", path: "/help" },
    { label: "Cancellation Policy", path: "/cancellation-policy" },
    { label: "FAQs", path: "/faq" },
  ],
  socials: [
    { icon: Facebook, label: "Facebook", href: "https://facebook.com/staybnb" },
    { icon: Instagram, label: "Instagram", href: "https://instagram.com/staybnb" },
    { icon: Twitter, label: "Twitter", href: "https://twitter.com/staybnb" },
    { icon: WhatsApp, label: "WhatsApp", href: "https://wa.me/1234567890" } // Working WhatsApp link
  ],
  payments: [
    { name: "Visa", color: "text-blue-600" },
    { name: "Mastercard", color: "text-orange-500" },
    { name: "UPI", color: "text-emerald-600" },
    { name: "PayPal", color: "text-blue-700" }
  ]
};

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { user } = useApp();

  return (
    <footer className="mt-24 border-t border-border bg-card shadow-[0_-1px_15px_rgba(0,0,0,0.03)]">
      <div className="container py-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Brand & Social */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="rounded-xl bg-rose-500 p-2 text-white transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">
                <Hotel className="h-5 w-5" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-foreground">WanderLust</span>
            </Link>
            <p className="max-w-[240px] text-sm leading-relaxed text-muted-foreground">
              Find and book the best hotels for your perfect stay. Experience luxury and comfort tailored for you.
            </p>
            <div className="flex items-center gap-3">
              {FOOTER_CONFIG.socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="grid h-10 w-10 place-items-center rounded-full bg-muted/50 text-muted-foreground transition-all duration-300 hover:bg-rose-500 hover:text-white hover:shadow-lg hover:shadow-rose-500/25 active:scale-95"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Explore */}
          <div>
            <h4 className="mb-6 text-sm font-bold uppercase tracking-wider text-foreground/70">Explore</h4>
            <ul className="space-y-4">
              {FOOTER_CONFIG.explore.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-sm text-muted-foreground transition-all duration-200 hover:text-rose-500 hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h4 className="mb-6 text-sm font-bold uppercase tracking-wider text-foreground/70">Company</h4>
            <ul className="space-y-4">
              {FOOTER_CONFIG.company.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-sm text-muted-foreground transition-all duration-200 hover:text-rose-500 hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Support */}
          <div>
            <h4 className="mb-6 text-sm font-bold uppercase tracking-wider text-foreground/70">Support</h4>
            <ul className="space-y-4">
              {/* Dynamic My Bookings link */}
              {user && (
                <li>
                  <Link
                    to="/bookings"
                    className="text-sm font-semibold text-rose-500 transition-all duration-200 hover:translate-x-1 inline-block"
                  >
                    My Bookings
                  </Link>
                </li>
              )}
              {FOOTER_CONFIG.support.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-sm text-muted-foreground transition-all duration-200 hover:text-rose-500 hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 border-t border-border pt-8">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <p className="text-sm font-medium text-muted-foreground">
              © {currentYear} Staybnb. All rights reserved.
            </p>

            <div className="flex items-center gap-6 text-sm font-semibold text-muted-foreground">
              <Link to="/privacy" className="hover:text-rose-500 transition-colors">Privacy Policy</Link>
              <span className="hidden h-4 w-px bg-border md:block" />
              <Link to="/terms" className="hover:text-rose-500 transition-colors">Terms & Conditions</Link>
            </div>

            <div className="flex items-center gap-3">
              {FOOTER_CONFIG.payments.map((payment) => (
                <div
                  key={payment.name}
                  title={payment.name}
                  className="flex h-9 w-14 items-center justify-center rounded-xl border border-border bg-background shadow-sm transition-all duration-300 hover:border-rose-200 hover:shadow-md cursor-default group"
                >
                  <span className={`text-[10px] font-black uppercase tracking-tighter transition-colors group-hover:scale-110 ${payment.color}`}>
                    {payment.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

