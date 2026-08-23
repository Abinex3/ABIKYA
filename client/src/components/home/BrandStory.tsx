import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import storyImage from "../../assets/story/tattoo-story.png";

function BrandStory() {
  return (
    <section className="w-full bg-white">
      <div
        className="
          mx-auto
          grid
          max-w-[1600px]
          grid-cols-1
          overflow-hidden
          border-y
          border-black/10

          lg:grid-cols-[38%_62%]
        "
      >
        {/* LEFT CONTENT */}
        <div
          className="
            flex
            items-center
            px-6
            py-14

            sm:px-10
            sm:py-16

            lg:px-14
            lg:py-20

            xl:px-16
          "
        >
          <div className="max-w-md">
            {/* EYEBROW */}
            <p
              className="
                mb-5
                text-[10px]
                uppercase
                tracking-[0.24em]
                text-black/45

                sm:text-xs
              "
            >
              The ABIKYATATTOOS Story
            </p>

            {/* HEADING */}
            <h2
              className="
                text-3xl
                leading-[0.98]
                tracking-tight
                text-black

                sm:text-4xl

                lg:text-5xl

                xl:text-[56px]
              "
            >
              MORE THAN
              <br />
              JEWELLERY.
              <br />
              IT'S A LIFESTYLE.
            </h2>

            {/* DECORATIVE LINE */}
            <div className="my-7 flex items-center gap-3">
              <span className="h-px w-12 bg-black" />

              <span className="h-1.5 w-1.5 rounded-full bg-black" />

              <span className="h-px w-5 bg-black/30" />
            </div>

            {/* DESCRIPTION */}
            <p
              className="
                max-w-sm
                text-sm
                leading-7
                text-black/60

                sm:text-[15px]
              "
            >
              At ABIKYATATTOOS, jewellery and tattoo culture meet in one
              expression of individuality. Every piece is chosen to complement
              your piercing, your ink, and your personal style.
            </p>

            {/* CTA */}
            <Link
  to="/about"
  className="
    group
    mt-8
    inline-flex
    min-h-[52px]
    items-center
    justify-center
    gap-3
    bg-black
    px-7
    text-[11px]
    font-semibold
    uppercase
    tracking-[0.16em]
    !text-white
    transition-all
    duration-300
    hover:bg-red-600
    hover:!text-white
  "
>
  <span className="!text-white">
    Our Story
  </span>

  <ArrowRight
    size={16}
    strokeWidth={1.7}
    className="
      text-white
      transition-transform
      duration-300
      group-hover:translate-x-1
    "
  />
</Link>
          </div>
        </div>

        {/* RIGHT EDITORIAL IMAGE */}
        <div
          className="
            group
            relative
            min-h-[380px]
            overflow-hidden

            sm:min-h-[480px]

            lg:min-h-[620px]
          "
        >
          <img
            src={storyImage}
            alt="Tattoo artist working on a tattoo design"
            loading="lazy"
            className="
              absolute
              inset-0
              h-full
              w-full
              object-cover
              object-center
              transition-transform
              duration-[1200ms]
              ease-out

              group-hover:scale-[1.025]
            "
          />

          {/* SUBTLE IMAGE OVERLAY */}
          <div
            className="
              pointer-events-none
              absolute
              inset-0
              bg-gradient-to-r
              from-black/[0.05]
              via-transparent
              to-black/[0.10]
            "
          />

          {/* SMALL EDITORIAL LABEL */}
          <div
            className="
              absolute
              bottom-5
              right-5
              border
              border-white/40
              bg-black/25
              px-4
              py-2
              backdrop-blur-sm

              sm:bottom-7
              sm:right-7
            "
          >
            <p
              className="
                text-[9px]
                uppercase
                tracking-[0.2em]
                text-white

                sm:text-[10px]
              "
            >
              Ink · Piercing · Identity
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BrandStory;