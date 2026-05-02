import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { properties } from "@/data/properties";
import { FilterSidebar, Filters } from "@/components/FilterSidebar";
import { PropertyCard } from "@/components/PropertyCard";
import { PropertyCardSkeleton } from "@/components/PropertyCardSkeleton";
import { useDebounce } from "@/hooks/useDebounce";

const Search = () => {
  const [params] = useSearchParams();
  const initialQ = params.get("q") || "";
  const [query, setQuery] = useState(initialQ);
  const debounced = useDebounce(query, 250);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({ type: "all", maxPrice: 800, location: "" });

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, [debounced, filters]);

  const results = useMemo(() => {
    const q = debounced.toLowerCase();
    const loc = filters.location.toLowerCase();
    return properties.filter((p) => {
      if (filters.type !== "all" && p.type !== filters.type) return false;
      if (p.price > filters.maxPrice) return false;
      if (loc && !`${p.location} ${p.country}`.toLowerCase().includes(loc)) return false;
      if (q && !`${p.title} ${p.location} ${p.country}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [debounced, filters]);

  return (
    <section className="container py-8">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-bold md:text-4xl">{initialQ ? `Stays matching "${initialQ}"` : "Explore stays"}</h1>
        <p className="mt-1 text-muted-foreground">{results.length} place{results.length !== 1 && "s"} found</p>
        <div className="mt-4 max-w-xl">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Refine by destination or stay name…"
            className="w-full rounded-full border border-border bg-card px-5 py-3 text-sm shadow-soft outline-none transition-smooth focus:border-primary" />
        </div>
      </header>
      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <FilterSidebar filters={filters} onChange={setFilters} onReset={() => setFilters({ type: "all", maxPrice: 800, location: "" })} />
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
          {loading ? Array.from({ length: 6 }).map((_, i) => <PropertyCardSkeleton key={i} />)
            : results.length === 0 ? (
              <div className="col-span-full rounded-3xl border border-dashed border-border p-12 text-center">
                <p className="font-display text-xl font-semibold">No stays match those filters</p>
                <p className="mt-1 text-muted-foreground">Try widening your price or clearing the location.</p>
              </div>
            ) : results.map((p) => <PropertyCard key={p.id} property={p} />)}
        </div>
      </div>
    </section>
  );
};
export default Search;
