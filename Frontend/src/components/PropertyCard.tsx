import { Heart, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Property } from "@/data/properties";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";

interface Props {
  property: Property;
  priority?: boolean;
}

export const PropertyCard = ({ property, priority }: Props) => {
  const { isWished, toggleWishlist } = useApp();
  const wished = isWished(property.id);
  const [imgIdx, setImgIdx] = useState(0);

  return (
    <article className="group animate-fade-up">
      <Link to={`/property/${property._id || property.id}`} className="block">
        <div className="relative aspect-[4/3.2] overflow-hidden rounded-2xl bg-muted shadow-soft">
          <img
            src={property.images && property.images[imgIdx] 
              ? (typeof property.images[imgIdx] === 'string' ? property.images[imgIdx] : (property.images[imgIdx] as any).url)
              : "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop"}
            alt={property.title}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            width={1280}
            height={896}
            className="h-full w-full object-cover transition-smooth duration-700 group-hover:scale-105"
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(property._id || property.id);
            }}
            aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
            className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-background/30 backdrop-blur-md transition-smooth hover:scale-110"
          >
            <Heart
              className={cn(
                "h-5 w-5 transition-smooth",
                wished ? "fill-primary text-primary" : "fill-foreground/40 text-background"
              )}
            />
          </button>
          <div className="absolute left-3 top-3 flex gap-2">
            {(property as any).category && (
              <span className="rounded-full bg-background/90 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-primary border border-primary/10 backdrop-blur-sm">
                {(property as any).category}
              </span>
            )}
            {property.superhost && (
              <span className="rounded-full bg-background/90 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-foreground">
                Superhost
              </span>
            )}
          </div>
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {property.images?.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.preventDefault();
                  setImgIdx(i);
                }}
                aria-label={`Image ${i + 1}`}
                className={cn(
                  "h-1.5 rounded-full bg-background/70 transition-smooth",
                  imgIdx === i ? "w-5" : "w-1.5 opacity-70"
                )}
              />
            ))}
          </div>
        </div>

        <div className="mt-3 space-y-0.5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-1 font-semibold text-foreground">{property.location}</h3>
            <span className="flex shrink-0 items-center gap-1 text-sm font-medium">
              <Star className="h-3.5 w-3.5 fill-foreground text-foreground" /> {property.rating}
            </span>
          </div>
          <p className="line-clamp-1 text-sm text-muted-foreground">{property.title}</p>
          <p className="text-sm text-muted-foreground">{property.beds} beds · {property.guests} guests</p>
          <p className="pt-1 text-foreground">
            <span className="font-semibold">${property.price}</span>
            <span className="text-muted-foreground"> night</span>
          </p>
        </div>
      </Link>
    </article>
  );
};