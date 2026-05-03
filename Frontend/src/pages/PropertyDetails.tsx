import { useParams, Link } from "react-router-dom";
import { Heart, MapPin, Share, Star, Award } from "lucide-react";
import { properties } from "@/data/properties";
import { ImageCarousel } from "@/components/ImageCarousel";
import { BookingCard } from "@/components/BookingCard";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";

import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/lib/api";
import { PropertyCardSkeleton } from "@/components/PropertyCardSkeleton";

const PropertyDetails = () => {
  const { id } = useParams();
  const { isWished, toggleWishlist } = useApp();

  const { data: property, isLoading, error } = useQuery({
    queryKey: ["hotel", id],
    queryFn: async () => {
      // Check static data first for demo properties
      const staticProp = properties.find(p => p.id === id);
      if (staticProp) return staticProp;

      return await adminApi.getHotelById(id!);
    },
    enabled: !!id,
  });

  if (isLoading) return <div className="container py-20"><PropertyCardSkeleton /></div>;

  if (error || !property) {
    return (
      <div className="container py-20 text-center">
        <h1 className="font-display text-3xl font-bold">Stay not found</h1>
        <p className="mt-2 text-muted-foreground">The property you're looking for doesn't exist or has been removed.</p>
        <Link to="/" className="mt-4 inline-block text-primary underline">Back home</Link>
      </div>
    );
  }
  const wished = isWished(property._id || property.id);

  return (
    <article className="container py-8">
      <header className="mb-6">
        <h1 className="font-display text-3xl font-bold md:text-4xl">{property.title}</h1>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1 text-foreground"><Star className="h-3.5 w-3.5 fill-foreground" /> {property.rating} · {property.reviews} reviews</span>
            {property.superhost && <span className="flex items-center gap-1 text-foreground"><Award className="h-3.5 w-3.5 text-primary" /> Superhost</span>}
            <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {property.location}, {property.country}</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold transition-smooth hover:bg-muted"><Share className="h-4 w-4" /> Share</button>
            <button onClick={() => toggleWishlist(property.id)} className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold transition-smooth hover:bg-muted">
              <Heart className={cn("h-4 w-4", wished && "fill-primary text-primary")} />{wished ? "Saved" : "Save"}
            </button>
          </div>
        </div>
      </header>
      <ImageCarousel 
        images={property.images?.map((img: any) => typeof img === 'string' ? img : img.url) || []} 
        alt={property.title} 
      />
      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_380px]">
        <div>
          <div className="flex items-center justify-between border-b border-border pb-6">
            <div>
              <h2 className="font-display text-2xl font-bold">
                Hosted by {typeof property.host === 'string' ? property.host : property.host?.name || "Premium Host"}
              </h2>
              <p className="mt-1 text-muted-foreground">{property.guests} guests · {property.beds} beds · {property.baths} bath</p>
            </div>
            <div className="grid h-14 w-14 place-items-center rounded-full gradient-primary font-bold text-primary-foreground uppercase">
              {(typeof property.host === 'string' ? property.host : property.host?.name || "P")[0]}
            </div>
          </div>
          <p className="mt-6 text-lg leading-relaxed text-foreground/85">{property.description}</p>
          {property.amenities && property.amenities.length > 0 && (
            <>
              <h3 className="mt-10 font-display text-xl font-bold">What this place offers</h3>
              <ul className="mt-4 grid grid-cols-2 gap-3">
                {property.amenities.map((a: string) => (
                  <li key={a} className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-sm font-medium">
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-muted">✦</span>{a}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
        <BookingCard property={property} />
      </div>
    </article>
  );
};
export default PropertyDetails;
