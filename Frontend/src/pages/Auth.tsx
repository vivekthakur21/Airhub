import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { toast } from "@/hooks/use-toast";
import { authApi } from "@/lib/api";
import { useApp } from "@/context/AppContext";

const Input = ({
  label,
  ...rest
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
  <label className="block">
    <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted-foreground">
      {label}
    </span>
    <input
      {...rest}
      className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition-smooth focus:border-primary"
    />
  </label>
);

const Auth = () => {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { loginUser } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    // Basic validation
    if (!email || !password) {
      toast({ title: "Missing fields", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }
    if (mode === "signup" && !name.trim()) {
      toast({ title: "Missing name", description: "Please enter your full name.", variant: "destructive" });
      return;
    }
    if (password.length < 6) {
      toast({ title: "Weak password", description: "Password must be at least 6 characters.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      if (mode === 'signup') {
        // Signup: just create account, do NOT auto-login
        await authApi.signup(name.trim(), email.trim(), password);
        toast({
          title: 'Account created! 🎉',
          description: 'Your account is ready. Please log in to continue.',
        });
        // Switch to login tab so user can authenticate
        setMode('login');
        setName('');
        setPassword('');
      } else {
        // Login: authenticate and store session
        const userData = await authApi.login(email.trim(), password);
        loginUser(userData);
        toast({
          title: 'Welcome back! 👋',
          description: `You are now logged in as ${userData.name}.`,
        });
        navigate('/');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      toast({ title: 'Authentication failed', description: message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container grid min-h-[calc(100vh-160px)] place-items-center py-10">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-elegant animate-scale-in">
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>

        {/* Tab switcher */}
        <div className="mb-6 grid grid-cols-2 rounded-full bg-muted p-1">
          {(["login", "signup"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={
                "rounded-full py-2 text-sm font-semibold transition-smooth " +
                (mode === m
                  ? "bg-card text-foreground shadow-soft"
                  : "text-muted-foreground hover:text-foreground")
              }
            >
              {m === "login" ? "Log in" : "Sign up"}
            </button>
          ))}
        </div>

        <h1 className="font-display text-2xl font-bold text-center">
          {mode === "login" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="mt-1 text-center text-sm text-muted-foreground">
          {mode === "login"
            ? "Log in to plan your next escape."
            : "Join and unlock unique homes around the world."}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
          {mode === "signup" && (
            <Input
              label="Full name"
              type="text"
              placeholder="Ada Lovelace"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
          )}
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl gradient-primary py-3 text-sm font-bold text-primary-foreground transition-smooth hover:scale-[1.01] hover:shadow-elegant disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                {mode === "login" ? "Signing in…" : "Creating account…"}
              </span>
            ) : mode === "login" ? (
              "Log in"
            ) : (
              "Create account"
            )}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" /> or continue with{" "}
          <span className="h-px flex-1 bg-border" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {["Google", "Apple"].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() =>
                toast({
                  title: "Coming soon",
                  description: `${p} sign-in will be available shortly.`,
                })
              }
              className="rounded-2xl border border-border bg-background py-2.5 text-sm font-semibold transition-smooth hover:bg-muted"
            >
              {p}
            </button>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          By continuing you agree to our{" "}
          <Link to="/" className="underline">
            Terms
          </Link>{" "}
          &{" "}
          <Link to="/" className="underline">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </section>
  );
};

export default Auth;
