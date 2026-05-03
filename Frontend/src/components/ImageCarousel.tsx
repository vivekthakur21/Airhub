import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const ImageCarousel = ({ images, alt }: { images: string[]; alt: string }) => {
  const [i, setI] = useState(0);
  return (
    <div className="relative overflow-hidden rounded-3xl bg-muted">
      <div className="aspect-[16/9] w-full">
        <img src={images[i]} alt={alt} className="h-full w-full object-cover transition-smooth" loading="lazy" />
      </div>
      <button onClick={() => setI((p) => (p - 1 + images.length) % images.length)} aria-label="Previous"
        className="absolute left-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-background/90 shadow-card transition-smooth hover:scale-110">
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button onClick={() => setI((p) => (p + 1) % images.length)} aria-label="Next"
        className="absolute right-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-background/90 shadow-card transition-smooth hover:scale-110">
        <ChevronRight className="h-5 w-5" />
      </button>
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
        {images.map((_, idx) => (
          <button key={idx} onClick={() => setI(idx)} aria-label={`Image ${idx + 1}`}
            className={cn("h-2 rounded-full bg-background/80 transition-smooth", i === idx ? "w-7" : "w-2")} />
        ))}
      </div>
    </div>
  );
};
