import { useEffect, useState } from "react";
import { User, Shield, Trash2, Search, CheckCircle, XCircle } from "lucide-react";
import { adminApi, AuthUser } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const AdminUsers = () => {
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await adminApi.getUsers();
      setUsers(data);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await adminApi.deleteUser(id);
      setUsers(users.filter((u) => u._id !== id));
      toast({ title: "Success", description: "User deleted" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const filteredUsers = users.filter((u) => 
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 p-8">
      <header>
        <h1 className="font-display text-3xl font-bold">Manage Users</h1>
        <p className="text-muted-foreground">Monitor and manage user accounts.</p>
      </header>

      <div className="rounded-3xl border border-border bg-card shadow-soft overflow-hidden">
        <div className="p-4 border-b border-border flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text"
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-border bg-background outline-none focus:border-primary transition-smooth"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <table className="w-full text-left">
          <thead className="bg-muted/50 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Joined</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-sm">
            {filteredUsers.map((u) => (
              <tr key={u._id} className="transition-smooth hover:bg-muted/30">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="grid h-8 w-8 place-items-center rounded-full bg-primary/10 text-primary font-bold text-xs uppercase">
                      {u.name[0]}
                    </div>
                    <div>
                      <p className="font-semibold">{u.name}</p>
                      <p className="text-xs text-muted-foreground">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase",
                    u.role === "admin" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                  )}>
                    {u.role === "admin" && <Shield className="h-3 w-3" />}
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-muted-foreground italic">Recently</td>
                <td className="px-6 py-4 text-right">
                   <button 
                     onClick={() => handleDelete(u._id)}
                     disabled={u.role === "admin"}
                     className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-smooth disabled:opacity-30 disabled:cursor-not-allowed"
                   >
                     <Trash2 className="h-4 w-4" />
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
