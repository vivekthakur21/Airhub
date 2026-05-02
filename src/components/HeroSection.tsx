import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Calendar, Users } from "lucide-react";
import hero from "@/assets/hero.jpg";

const Field = ({ icon, label, placeholder, value, onChange, type = "text" }: {
  icon: React.ReactNode; label: string; placeholder: string; value: string; onChange: (v: string) => void; type?: string;
}) => (
  <label className="group flex cursor-text items-center gap-3 rounded-2xl px-5 py-2 transition-smooth hover:bg-muted md:rounded-full">
    <span className="grid h-9 w-9 place-items-center rounded-full bg-muted text-foreground group-hover:bg-background">{icon}</span>
    <span className="flex-1">
      <span className="block text-[11px] font-bold uppercase tracking-wide text-muted-foreground">{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-muted-foreground" />
    </span>
  </label>
);

export const HeroSection = () => {
  const [where, setWhere] = useState("");
  const [when, setWhen] = useState("");
  const [guests, setGuests] = useState("");
  const navigate = useNavigate();

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (where) params.set("q", where);
    if (when) params.set("when", when);
    if (guests) params.set("guests", guests);
    navigate(`/search?${params.toString()}`);
  };

  return (
    <section className="relative -mt-px overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <img src={hero} alt="Cliffside villa overlooking the ocean at sunset" width={1920} height={1280} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/10 via-foreground/30 to-background" />
      </div>
      <div className="container relative pb-16 pt-20 md:pb-28 md:pt-32">
        <div className="max-w-3xl animate-fade-up">
          <span className="inline-block rounded-full bg-background/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-background backdrop-blur-md">
            ✨ 2M+ unique stays worldwide
          </span>
          <h1 className="mt-6 text-balance text-5xl font-extrabold leading-[1.05] text-background sm:text-6xl md:text-7xl">
            Not just a stay.<br />
            <span className="bg-gradient-to-r from-background via-primary-foreground to-primary bg-clip-text text-transparent">A story worth telling.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-background/85">
            From sun-drenched villas to alpine cabins, find the unforgettable corner of the world made for you.
          </p>
        </div>
        <form onSubmit={onSearch}
          className="relative mt-12 grid gap-2 rounded-3xl border border-border bg-card p-3 shadow-elegant md:grid-cols-[1.4fr_1fr_1fr_auto] md:gap-0 md:rounded-full md:p-2 animate-scale-in">
          <Field icon={<MapPin className="h-4 w-4" />} label="Where" placeholder="Search destinations" value={where} onChange={setWhere} />
          <span className="hidden self-stretch border-l border-border md:block" />
          <Field icon={<Calendar className="h-4 w-4" />} label="When" placeholder="Add dates" type="date" value={when} onChange={setWhen} />
          <span className="hidden self-stretch border-l border-border md:block" />
          <Field icon={<Users className="h-4 w-4" />} label="Guests" placeholder="Add guests" value={guests} onChange={setGuests} />
          <button type="submit" className="flex items-center justify-center gap-2 rounded-2xl gradient-primary px-6 py-4 text-sm font-semibold text-primary-foreground transition-smooth hover:scale-[1.02] md:rounded-full md:py-3">
            <Search className="h-4 w-4" /> Search
          </button>
        </form>
      </div>
    </section>
  );
};
