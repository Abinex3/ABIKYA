import {  ArrowUpRight } from "lucide-react";

function InstagramSection() {
  return (
    <section className="w-full bg-[#f5f5f5] border-y border-black/10">
      <div className="mx-auto max-w-[1600px] px-6 py-14 sm:px-10 sm:py-16 lg:px-16 lg:py-20">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          
          {/* LEFT CONTENT */}
          <div>
            <p className="mb-4 text-[10px] uppercase tracking-[0.24em] text-black/45 sm:text-xs">
              Follow the culture
            </p>

            <h2 className="max-w-5xl text-3xl leading-[1.05] tracking-tight text-black sm:text-4xl md:text-5xl lg:text-[56px]">
              JOIN OUR INSTAGRAM COMMUNITY!
            </h2>

            <p className="mt-5 max-w-2xl text-xs uppercase leading-6 tracking-[0.06em] text-black/60 sm:text-sm">
              Piercing inspiration, new launches, restocks, tattoo culture and a
              lot more.
            </p>
          </div>

          {/* INSTAGRAM CTA */}
          <a
            href="https://instagram.com/"
            target="_blank"
            rel="noreferrer"
            className="
              group
              inline-flex
              w-fit
              items-center
              gap-4
              border
              border-black
              bg-black
              px-6
              py-4
              !text-white
              transition-all
              duration-300
              hover:bg-transparent
              hover:!text-black
            "
          >
            {/* <Instagram size={18} strokeWidth={1.5} /> */}

            <span className="text-[10px] font-medium uppercase tracking-[0.17em]">
              @abikyatattoos
            </span>

            <ArrowUpRight
              size={16}
              strokeWidth={1.5}
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </a>
        </div>
      </div>
    </section>
  );
}

export default InstagramSection;