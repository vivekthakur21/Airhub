import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Hotel, 
  Calendar, 
  Users, 
  LogOut, 
  ChevronRight,
  BarChart3,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";

const navItems = [
  { icon: LayoutDashboard, label: "Overview", to: "/admin" },
  { icon: Hotel, label: "Property Management", to: "/admin/hotels" },
  { icon: Calendar, label: "Reservations", to: "/admin/bookings" },
  { icon: Users, label: "User Accounts", to: "/admin/users" },
  { icon: BarChart3, label: "Analytics", to: "/admin/analytics" },
  { icon: Settings, label: "Settings", to: "/admin/settings" },
];

export const AdminSidebar = () => {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 border-r border-border/40 bg-card/80 backdrop-blur-xl p-8 shadow-2xl z-50">
      <div className="mb-12 flex items-center gap-2">
        <Logo />
        <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter">
          Admin
        </span>
      </div>
      
      <nav className="space-y-3">
        <p className="px-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">Main Menu</p>
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              "group flex items-center justify-between rounded-2xl px-5 py-3.5 text-sm font-semibold transition-all duration-300",
              location.pathname === item.to
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 translate-x-2"
                : "text-muted-foreground hover:bg-primary/5 hover:text-foreground"
            )}
          >
            <div className="flex items-center gap-4">
              <item.icon className={cn("h-5 w-5 transition-transform duration-300 group-hover:scale-110")} />
              {item.label}
            </div>
            {location.pathname === item.to && <ChevronRight className="h-4 w-4" />}
          </Link>
        ))}
      </nav>

      <div className="absolute bottom-10 left-8 right-8">
        <div className="rounded-2xl bg-muted/50 p-4 mb-6">
          <p className="text-xs font-medium text-muted-foreground">Need help?</p>
          <p className="text-[10px] text-muted-foreground mt-1">Check the admin documentation or contact support.</p>
        </div>
        <Link
          to="/"
          className="flex items-center gap-4 rounded-2xl px-5 py-3.5 text-sm font-semibold text-destructive transition-all duration-300 hover:bg-destructive/10"
        >
          <LogOut className="h-5 w-5" />
          Logout to User View
        </Link>
      </div>
    </aside>
  );
};
