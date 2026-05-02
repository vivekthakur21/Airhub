import { useState } from "react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { toast } from "@/hooks/use-toast";

const Input = ({ label, ...rest }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
  <label className="block">
    <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted-foreground">{label}</span>
    <input {...rest} className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition-smooth focus:border-primary" />
  </label>
);

const Auth = () => {
  const [mode, setMode] = useState<"login" | "signup">("login");
  return (
    <section className="container grid min-h-[calc(100vh-160px)] place-items-center py-10">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-elegant animate-scale-in">
        <div className="mb-6 flex justify-center"><Logo /></div>
        <div className="mb-6 grid grid-cols-2 rounded-full bg-muted p-1">
          {(["login", "signup"] as const).map((m) => (
            <button key={m} onClick={() => setMode(m)}
              className={"rounded-full py-2 text-sm font-semibold transition-smooth " + (mode === m ? "bg-card text-foreground shadow-soft" : "text-muted-foreground hover:text-foreground")}>
              {m === "login" ? "Log in" : "Sign up"}
            </button>
          ))}
        </div>
        <h1 className="font-display text-2xl font-bold text-center">{mode === "login" ? "Welcome back" : "Create your account"}</h1>
        <p className="mt-1 text-center text-sm text-muted-foreground">{mode === "login" ? "Log in to plan your next escape." : "Join Staybnb and unlock unique homes."}</p>
        <form onSubmit={(e) => { e.preventDefault(); toast({ title: "Demo only", description: "Hook this up with Lovable Cloud auth." }); }} className="mt-6 space-y-3">
          {mode === "signup" && <Input label="Full name" type="text" placeholder="Ada Lovelace" />}
          <Input label="Email" type="email" placeholder="you@example.com" />
          <Input label="Password" type="password" placeholder="••••••••" />
          <button type="submit" className="w-full rounded-2xl gradient-primary py-3 text-sm font-bold text-primary-foreground transition-smooth hover:scale-[1.01] hover:shadow-elegant">
            {mode === "login" ? "Log in" : "Create account"}
          </button>
        </form>
        <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" /> or continue with <span className="h-px flex-1 bg-border" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {["Google", "Apple"].map((p) => (
            <button key={p} className="rounded-2xl border border-border bg-background py-2.5 text-sm font-semibold transition-smooth hover:bg-muted">{p}</button>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          By continuing you agree to our <Link to="/" className="underline">Terms</Link> & <Link to="/" className="underline">Privacy Policy</Link>.
        </p>
      </div>
    </section>
  );
};
export default Auth;
