import { useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Star,
} from "lucide-react";

// Replace these with your actual review images
import review1 from "../../assets/reviews/review-1.jpeg";
import review2 from "../../assets/reviews/review-2.jpeg";
import review3 from "../../assets/reviews/review-3.jpeg";
import review4 from "../../assets/reviews/review-4.jpeg";
import review5 from "../../assets/reviews/review-5.jpeg";
import review6 from "../../assets/reviews/review-6.jpeg";

type Review = {
  id: number;
  name: string;
  location?: string;
  review: string;
  image: string;
  rating: number;
};

const reviews: Review[] = [
  {
    id: 1,
    name: "Aarohi",
    location: "Mumbai",
    review:
      "The finish is beautiful and the stud feels so comfortable even after wearing it all day. Easily one of my favourite pieces.",
    image: review1,
    rating: 5,
  },
  {
    id: 2,
    name: "Meera",
    location: "Pune",
    review:
      "I love how minimal it looks while still standing out. The silver quality feels premium and the fit is perfect.",
    image: review2,
    rating: 5,
  },
  {
    id: 3,
    name: "Riya",
    location: "Bengaluru",
    review:
      "Finally found piercing jewellery that actually matches my style. Clean, edgy and very easy to wear.",
    image: review3,
    rating: 5,
  },
  {
    id: 4,
    name: "Ishita",
    location: "Delhi",
    review:
      "The detailing is even better in person. I paired it with my other piercings and the whole stack looks amazing.",
    image: review4,
    rating: 5,
  },
  {
    id: 5,
    name: "Tanvi",
    location: "Hyderabad",
    review:
      "Super comfortable, lightweight and beautifully finished. I’ve already started planning my next piercing stack.",
    image: review5,
    rating: 5,
  },
  {
    id: 6,
    name: "Naina",
    location: "Chennai",
    review:
      "Exactly the kind of jewellery I was looking for — minimal but with personality. Packaging and quality were both great.",
    image: review6,
    rating: 5,
  },
];

function CustomerReviews() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({
      left: -420,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({
      left: 420,
      behavior: "smooth",
    });
  };

  const handleScroll = () => {
    const container = scrollRef.current;

    if (!container) return;

    const maxScroll =
      container.scrollWidth - container.clientWidth;

    if (maxScroll <= 0) {
      setScrollProgress(100);
      return;
    }

    const progress =
      (container.scrollLeft / maxScroll) * 100;

    setScrollProgress(
      Math.min(100, Math.max(0, progress))
    );
  };

  return (
    <section className="w-full bg-[#111111] text-white">
      {/* HEADER */}
      <div className="border-b border-white/10 px-6 py-14 sm:px-10 lg:px-16 lg:py-16">
        <div className="mx-auto flex max-w-[1600px] items-end justify-between gap-8">
          <div>
            <p className="mb-3 text-[10px] uppercase tracking-[0.24em] text-white/45 sm:text-xs">
              Worn. Loved. Repeated.
            </p>

            <h2 className="max-w-4xl text-3xl leading-[1.05] tracking-tight sm:text-4xl lg:text-5xl">
              LOVED BY OUR COMMUNITY
            </h2>

            <p className="mt-4 max-w-xl text-xs leading-6 text-white/55 sm:text-sm">
              Real people. Real piercings. Real stories from the
              ABIKYATATTOOS community.
            </p>
          </div>

          {/* ARROWS */}
          <div className="hidden items-center gap-3 sm:flex">
            <button
              type="button"
              onClick={scrollLeft}
              aria-label="Previous reviews"
              className="
                flex h-11 w-11
                items-center justify-center
                border border-white/20
                text-white
                transition-all duration-300

                hover:bg-white
                hover:text-black
              "
            >
              <ChevronLeft
                size={19}
                strokeWidth={1.5}
              />
            </button>

            <button
              type="button"
              onClick={scrollRight}
              aria-label="Next reviews"
              className="
                flex h-11 w-11
                items-center justify-center
                border border-white/20
                text-white
                transition-all duration-300

                hover:bg-white
                hover:text-black
              "
            >
              <ChevronRight
                size={19}
                strokeWidth={1.5}
              />
            </button>
          </div>
        </div>
      </div>

      {/* REVIEWS */}
      <div className="mx-auto max-w-[1600px] px-4 py-10 sm:px-8 lg:px-16 lg:py-14">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="
            flex
            snap-x
            snap-mandatory
            gap-4
            overflow-x-auto
            scroll-smooth
            pb-2

            [scrollbar-width:none]
            [&::-webkit-scrollbar]:hidden
          "
        >
          {reviews.map((review) => (
            <article
              key={review.id}
              className="
                group
                w-[82vw]
                shrink-0
                snap-start
                bg-white
                text-black
                transition-transform
                duration-500
                ease-out

                hover:-translate-y-1

                sm:w-[360px]
                lg:w-[340px]
                xl:w-[360px]
              "
            >
              {/* IMAGE */}
              <div className="aspect-[4/4.2] overflow-hidden bg-[#eaeaea]">
                <img
                  src={review.image}
                  alt={`${review.name} wearing ABIKYATATTOOS jewellery`}
                  loading="lazy"
                  className="
                    h-full w-full
                    object-cover
                    transition-transform
                    duration-700
                    ease-out

                    group-hover:scale-[1.04]
                  "
                />
              </div>

              {/* CONTENT */}
              <div className="p-5 sm:p-6">
                {/* STARS */}
                <div className="flex items-center gap-1">
                  {Array.from({
                    length: review.rating,
                  }).map((_, index) => (
                    <Star
                      key={index}
                      size={15}
                      strokeWidth={1.3}
                      fill="currentColor"
                      className="text-black"
                    />
                  ))}
                </div>

                {/* REVIEW */}
                <blockquote className="mt-5 text-[15px] leading-6 text-black/80 sm:text-base">
                  “{review.review}”
                </blockquote>

                {/* CUSTOMER */}
                <div className="mt-6 border-t border-black/10 pt-4">
                  <p className="text-sm font-medium uppercase tracking-[0.08em]">
                    {review.name}
                  </p>

                  {review.location && (
                    <p className="mt-1 text-[10px] uppercase tracking-[0.15em] text-black/45">
                      {review.location}
                    </p>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* PROGRESS BAR */}
        <div className="mt-10">
          <div className="relative h-[4px] w-full overflow-hidden bg-white/15">
            <div
              className="
                absolute left-0 top-0
                h-full
                bg-white
                transition-[width]
                duration-150
                ease-out
              "
              style={{
                width: `${
                  22 + scrollProgress * 0.78
                }%`,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default CustomerReviews;