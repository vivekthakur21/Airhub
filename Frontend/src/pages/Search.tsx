import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FilterSidebar, Filters } from "@/components/FilterSidebar";
import { PropertyCard } from "@/components/PropertyCard";
import { PropertyCardSkeleton } from "@/components/PropertyCardSkeleton";
import { useDebounce } from "@/hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/lib/api";

const Search = () => {
  const [params] = useSearchParams();
  const initialQ = params.get("q") || "";
  const [query, setQuery] = useState(initialQ);
  const debounced = useDebounce(query, 500);
  const [filters, setFilters] = useState<Filters>({ type: "all", maxPrice: 800, location: "" });

  const { data: results, isLoading } = useQuery({
    queryKey: ["search", debounced, filters],
    queryFn: async () => {
      const res = await adminApi.getHotels({
        location: filters.location || debounced,
        category: filters.type === "all" ? undefined : filters.type,
        maxPrice: filters.maxPrice,
      }) as any;
      return Array.isArray(res) ? res : res.listings || [];
    },
  });

  return (
    <section className="container py-8">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-bold md:text-4xl">{initialQ ? `Stays matching "${initialQ}"` : "Explore stays"}</h1>
        <p className="mt-1 text-muted-foreground">{results?.length || 0} place{(results?.length !== 1) && "s"} found</p>
        <div className="mt-4 max-w-xl">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Refine by destination or stay name…"
            className="w-full rounded-full border border-border bg-card px-5 py-3 text-sm shadow-soft outline-none transition-smooth focus:border-primary" />
        </div>
      </header>
      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <FilterSidebar filters={filters} onChange={setFilters} onReset={() => setFilters({ type: "all", maxPrice: 800, location: "" })} />
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
          {isLoading ? Array.from({ length: 6 }).map((_, i) => <PropertyCardSkeleton key={i} />)
            : !results || results.length === 0 ? (
              <div className="col-span-full rounded-3xl border border-dashed border-border p-12 text-center">
                <p className="font-display text-xl font-semibold">No stays match those filters</p>
                <p className="mt-1 text-muted-foreground">Try widening your price or clearing the location.</p>
              </div>
            ) : results.map((p: any) => <PropertyCard key={p._id || p.id} property={p} />)}
        </div>
      </div>
    </section>
  );
};
export default Search;
