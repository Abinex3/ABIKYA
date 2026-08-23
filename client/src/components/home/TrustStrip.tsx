import {
  Award,
  ShieldCheck,
  PackageCheck,
  Truck,
} from "lucide-react";

const trustItems = [
  {
    icon: Award,
    title: "925 SILVER",
    subtitle: "Premium Quality",
  },
  {
    icon: ShieldCheck,
    title: "SKIN FRIENDLY",
    subtitle: "Nickel Free",
  },
  {
    icon: PackageCheck,
    title: "EASY RETURNS",
    subtitle: "7 Days Return",
  },
  {
    icon: Truck,
    title: "FAST DELIVERY",
    subtitle: "Pan India",
  },
];

function TrustStrip() {
  return (
    <section className="w-full border-b border-black/10 bg-[#fafafa]">
      <div className="mx-auto grid max-w-[1600px] grid-cols-2 px-4 sm:px-8 lg:grid-cols-4 lg:px-12">
        {trustItems.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className={`
                flex min-h-[120px] items-center justify-center
                px-3 py-5 sm:min-h-[130px] sm:px-6
                lg:min-h-[125px] lg:py-6
                ${index % 2 !== 0 ? "border-l border-black/10" : ""}
                ${index >= 2 ? "border-t border-black/10 lg:border-t-0" : ""}
                ${index > 0 ? "lg:border-l lg:border-black/10" : "lg:border-l-0"}
              `}
            >
              <div className="flex flex-col items-center text-center">
                <Icon
                  size={30}
                  strokeWidth={1.4}
                  className="mb-3 text-black sm:h-8 sm:w-8"
                />

                <h3 className="text-[11px] font-semibold uppercase tracking-[0.04em] text-black sm:text-xs">
                  {item.title}
                </h3>

                <p className="mt-1 text-[10px] text-black/65 sm:text-[11px]">
                  {item.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default TrustStrip;