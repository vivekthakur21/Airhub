import { useMemo, useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import { CategoryBar } from "@/components/CategoryBar";
import { PropertyCard } from "@/components/PropertyCard";
import { PropertyCardSkeleton } from "@/components/PropertyCardSkeleton";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/lib/api";

const Index = () => {
  const [active, setActive] = useState("all");

  const { data, isLoading } = useQuery({
    queryKey: ["hotels", active],
    queryFn: async () => {
      const res = await adminApi.getHotels({ 
        category: active === "all" ? undefined : active 
      }) as any;
      return Array.isArray(res) ? res : res.listings || [];
    },
  });

  const filtered = useMemo(() => data || [], [data]);

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
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => <PropertyCardSkeleton key={i} />)
          ) : filtered.length > 0 ? (
            filtered.map((p: any, i: number) => (
              <PropertyCard key={p._id} property={p} priority={i < 4} />
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <p className="text-xl font-medium text-muted-foreground">No hotels available in this category.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Index;
