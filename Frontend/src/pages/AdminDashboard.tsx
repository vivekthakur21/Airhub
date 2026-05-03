import { useEffect, useState } from "react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Users, 
  Hotel, 
  Calendar, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  Search,
  Bell,
  Clock,
  MoreHorizontal,
  TrendingUp
} from "lucide-react";
import { adminApi, AdminStats } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const StatCard = ({ label, value, icon: Icon, trend, positive }: { label: string; value: string | number; icon: any; trend: string; positive: boolean }) => (
  <div className="group relative overflow-hidden rounded-[2.5rem] border border-border/50 bg-card p-8 shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl">
    <div className="relative z-10">
      <div className="flex items-start justify-between">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/5 text-primary transition-colors duration-500 group-hover:bg-primary group-hover:text-primary-foreground">
          <Icon className="h-7 w-7" />
        </div>
        <div className={cn(
          "flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full",
          positive ? "text-green-600 bg-green-500/10" : "text-rose-600 bg-rose-500/10"
        )}>
          {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          {trend}
        </div>
      </div>
      <div className="mt-6">
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">{label}</p>
        <h3 className="mt-2 text-4xl font-bold tracking-tight">{value}</h3>
      </div>
      <div className="mt-6 flex items-end gap-1 h-8 opacity-20">
        {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
          <div key={i} className="flex-1 bg-primary rounded-t-sm" style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
    <div className="absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-primary/5 transition-transform duration-700 group-hover:scale-150" />
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [analyticsData, setAnalyticsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, analyticsRes] = await Promise.all([
          adminApi.getStats(),
          adminApi.getAnalytics()
        ]);
        setStats(statsRes);
        setAnalyticsData(analyticsRes.map(item => ({
          name: item._id,
          revenue: item.revenue
        })));
      } catch (err: any) {
        toast({ title: "Error", description: err.message, variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-background p-10 space-y-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
            <Clock className="h-4 w-4" />
            <span>Last updated: {new Date().toLocaleTimeString()}</span>
          </div>
          <h1 className="font-display text-4xl font-extrabold tracking-tight">System Analytics</h1>
          <p className="text-muted-foreground mt-1">Real-time performance overview of Cozy Finds.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden lg:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input type="text" placeholder="Search reports..." className="h-12 w-64 rounded-full border border-border bg-card pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
          </div>
          <button className="relative grid h-12 w-12 place-items-center rounded-full bg-card border border-border text-muted-foreground transition-all hover:bg-muted">
            <Bell className="h-5 w-5" />
            <span className="absolute top-3 right-3 h-2 w-2 rounded-full bg-primary" />
          </button>
          <div className="h-12 w-12 rounded-full bg-primary shadow-lg shadow-primary/20" />
        </div>
      </header>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Revenue" value={`$${stats?.totalRevenue?.toLocaleString() || 0}`} icon={DollarSign} trend="24.8%" positive={true} />
        <StatCard label="Active Users" value={stats?.totalUsers || 0} icon={Users} trend="12.5%" positive={true} />
        <StatCard label="Properties" value={stats?.totalHotels || 0} icon={Hotel} trend="3.2%" positive={true} />
        <StatCard label="New Bookings" value={stats?.totalBookings || 0} icon={Calendar} trend="8.4%" positive={false} />
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
        <div className="space-y-10">
          <div className="rounded-[2.5rem] border border-border/50 bg-card p-8 shadow-soft">
            <div className="flex items-center justify-between border-b border-border/50 pb-6">
              <h2 className="font-display text-xl font-bold">Revenue Growth</h2>
              <TrendingUp className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="mt-8 h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analyticsData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#F43F5E" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748B' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748B' }} />
                  <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                  <Area type="monotone" dataKey="revenue" stroke="#F43F5E" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-[2.5rem] border border-border/50 bg-card shadow-soft overflow-hidden">
            <div className="p-8 border-b border-border/50 flex items-center justify-between">
              <h2 className="text-xl font-bold">Recent Activity</h2>
              <button className="text-sm font-bold text-primary">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-muted/30 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  <tr>
                    <th className="px-8 py-5">Customer</th>
                    <th className="px-8 py-5">Stay Date</th>
                    <th className="px-8 py-5">Amount</th>
                    <th className="px-8 py-5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50 text-sm">
                  {[
                    { name: "John Doe", email: "john@example.com", date: "May 12-15", price: 450, status: "Confirmed" },
                    { name: "Sarah Smith", email: "sarah@gmail.com", date: "May 18-20", price: 290, status: "Pending" },
                    { name: "Mike Ross", email: "mike@ross.co", date: "Jun 02-05", price: 780, status: "Refunded" },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-muted/10 transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-[10px]">{row.name[0]}</div>
                          <div>
                            <p className="font-bold">{row.name}</p>
                            <p className="text-[10px] text-muted-foreground">{row.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-muted-foreground">{row.date}</td>
                      <td className="px-8 py-5 font-bold">${row.price}</td>
                      <td className="px-8 py-5">
                        <span className={cn(
                          "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase",
                          row.status === "Confirmed" ? "bg-green-500/10 text-green-600" : "bg-amber-500/10 text-amber-600"
                        )}>{row.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="rounded-[2.5rem] bg-primary p-8 text-primary-foreground shadow-xl shadow-primary/20">
            <h3 className="text-lg font-bold">Pro Tip</h3>
            <p className="mt-3 text-sm opacity-90 leading-relaxed">Your conversion rate is up 15% this week. Consider adding more "Superhost" badges to boost bookings even further.</p>
            <button className="mt-6 w-full rounded-2xl bg-white/20 py-3 text-sm font-bold backdrop-blur-md hover:bg-white/30 transition-all">View Insights</button>
          </div>

          <div className="rounded-[2.5rem] border border-border/50 bg-card p-8 shadow-soft">
            <h3 className="text-lg font-bold mb-6 text-foreground">Device Distribution</h3>
            <div className="space-y-6">
              {[
                { label: "Desktop", value: 65, color: "bg-primary" },
                { label: "Mobile", value: 28, color: "bg-amber-500" },
                { label: "Tablet", value: 7, color: "bg-blue-500" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs font-bold mb-2 uppercase tracking-wider text-muted-foreground">
                    <span>{item.label}</span>
                    <span className="text-foreground">{item.value}%</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className={cn("h-full rounded-full", item.color)} style={{ width: `${item.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
