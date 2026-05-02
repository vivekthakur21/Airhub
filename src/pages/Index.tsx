import { useMemo, useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import { CategoryBar } from "@/components/CategoryBar";
import { PropertyCard } from "@/components/PropertyCard";
import { PropertyCardSkeleton } from "@/components/PropertyCardSkeleton";
import { properties } from "@/data/properties";
import { useEffect } from "react";

const Index = () => {
  const [active, setActive] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(
    () => (active === "all" ? properties : properties.filter((p) => p.type === active)),
    [active]
  );

  return (
    <>
      <HeroSection />
      <CategoryBar active={active} onChange={setActive} />
      <section className="container py-10">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold md:text-4xl">Featured stays</h2>
            <p className="mt-1 text-muted-foreground">Hand-picked homes our guests can't stop talking about.</p>
          </div>
          <span className="hidden text-sm text-muted-foreground md:block">{filtered.length} stays</span>
        </div>
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <PropertyCardSkeleton key={i} />)
            : filtered.map((p, i) => <PropertyCard key={p.id} property={p} priority={i < 4} />)}
        </div>
      </section>
    </>
  );
};

export default Index;
