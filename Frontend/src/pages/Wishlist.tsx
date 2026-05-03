import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { properties } from "@/data/properties";
import { useApp } from "@/context/AppContext";
import { PropertyCard } from "@/components/PropertyCard";

const Wishlist = () => {
  const { wishlist } = useApp();
  const items = properties.filter((p) => wishlist.includes(p.id));
  return (
    <section className="container py-10">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-bold md:text-4xl">Your wishlist</h1>
        <p className="mt-1 text-muted-foreground">{items.length} saved stay{items.length !== 1 && "s"} — ready when you are.</p>
      </header>
      {items.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border p-16 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-muted"><Heart className="h-7 w-7 text-muted-foreground" /></div>
          <h2 className="mt-5 font-display text-2xl font-semibold">Nothing saved yet</h2>
          <p className="mt-2 text-muted-foreground">Tap the heart on any stay to keep it here.</p>
          <Link to="/" className="mt-6 inline-block rounded-full gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-elegant transition-smooth hover:scale-105">Explore stays</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((p) => <PropertyCard key={p.id} property={p} />)}
        </div>
      )}
    </section>
  );
};
export default Wishlist;
