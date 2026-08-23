import { useState } from "react";
import { ChevronDown } from "lucide-react";

import studioImage from "../../assets/story/tattoo-story.png";

type FAQItem = {
  question: string;
  answer: string;
};

type FAQCategory = "store" | "orders" | "shipping";

const inStoreFaqs: FAQItem[] = [
  {
    question: "What payment modes do you accept in store?",
    answer:
      "For now, this section can show common payment options such as UPI, cards and supported digital payments. Final payment methods can be updated once confirmed by the studio.",
  },
  {
    question: "Are all online products available in store?",
    answer:
      "Online and studio stock may vary. If you are looking for a specific stud or jewellery design, we recommend contacting the studio before visiting.",
  },
  {
    question: "What piercing services are available?",
    answer:
      "ABIKYA TATTOOS offers piercing-related studio services. The final list of piercing services, prices and appointment details can be updated later.",
  },
  {
    question: "Do I need an appointment before visiting?",
    answer:
      "Appointments may be recommended for selected services. Contact the studio before visiting to confirm availability.",
  },
  {
    question: "Can I purchase jewellery without getting a piercing?",
    answer:
      "Yes. You can visit the studio and purchase available jewellery without booking a piercing service.",
  },
];

const onlineOrderFaqs: FAQItem[] = [
  {
    question: "How do I know if my order is confirmed?",
    answer:
      "Once your order is successfully placed, you will receive confirmation using the contact details provided during checkout.",
  },
  {
    question: "Can I change my order after placing it?",
    answer:
      "Changes may be possible before dispatch. Contact our support team as soon as possible with your order number.",
  },
  {
    question: "Can I cancel my online order?",
    answer:
      "Order cancellation may be possible before dispatch. Once the shipment has been handed over to the courier, cancellation may no longer be available.",
  },
  {
    question: "What if a product becomes unavailable after I order?",
    answer:
      "If an item becomes unavailable after purchase, our team will contact you and provide an appropriate solution such as a replacement or refund.",
  },
  {
    question: "How can I contact support about an online order?",
    answer:
      "Use our Contact page and include your order number so our team can assist you more quickly.",
  },
];

const shippingFaqs: FAQItem[] = [
  {
    question: "What shipping methods are available?",
    answer:
      "Shipping methods will depend on the delivery location and available courier partners. Final shipping options can be updated once the delivery workflow is confirmed.",
  },
  {
    question: "How long does shipping take?",
    answer:
      "Delivery time depends on the destination and courier partner. Estimated timelines will be shown during checkout once the shipping integration is complete.",
  },
  {
    question: "Do you provide express shipping?",
    answer:
      "Express shipping may be available for selected locations. Final availability and charges can be updated later.",
  },
  {
    question: "Is my order insured?",
    answer:
      "Shipment protection will depend on the courier and shipping method used. Final details can be added once confirmed.",
  },
  {
    question: "How can I track my shipment?",
    answer:
      "Tracking information will be shared after dispatch. Customers will also be able to use the order tracking page once the backend is connected.",
  },
];

function FAQ() {
  const [activeCategory, setActiveCategory] =
    useState<FAQCategory>("store");

  const [openQuestion, setOpenQuestion] =
    useState<number | null>(0);

  const getActiveFaqs = () => {
    switch (activeCategory) {
      case "orders":
        return onlineOrderFaqs;

      case "shipping":
        return shippingFaqs;

      default:
        return inStoreFaqs;
    }
  };

  const getCategoryContent = () => {
    switch (activeCategory) {
      case "orders":
        return {
          title: "ONLINE ORDERS",
          description:
            "Get quick answers about placing orders, payments, cancellations, product availability and online support.",
        };

      case "shipping":
        return {
          title: "SHIPPING",
          description:
            "Learn about delivery timelines, shipping options, tracking and shipment-related questions.",
        };

      default:
        return {
          title: "IN STORE",
          description:
            "Get quick answers about visiting ABIKYA TATTOOS, jewellery availability, piercing services and studio enquiries.",
        };
    }
  };

  const changeCategory = (
    category: FAQCategory
  ) => {
    setActiveCategory(category);
    setOpenQuestion(0);
  };

  const activeFaqs = getActiveFaqs();
  const categoryContent = getCategoryContent();

  return (
    <div className="w-full bg-[#f7f7f7] text-black">
      {/* =========================================
          PAGE HEADER
      ========================================= */}
      <section className="border-b border-black/10 bg-white">
        <div className="mx-auto max-w-[1600px] px-5 py-12 sm:px-8 lg:px-16 lg:py-16">
          <p className="text-[10px] uppercase tracking-[0.22em] text-black/40">
            Support
          </p>

          <h1 className="mt-3 text-3xl tracking-tight sm:text-4xl lg:text-5xl">
            HOW CAN WE HELP YOU?
          </h1>

          {/* TABS */}
          <div className="mt-8 flex flex-wrap gap-3">
            <FAQTab
              label="In Store"
              active={activeCategory === "store"}
              onClick={() =>
                changeCategory("store")
              }
            />

            <FAQTab
              label="Online Orders"
              active={activeCategory === "orders"}
              onClick={() =>
                changeCategory("orders")
              }
            />

            <FAQTab
              label="Shipping"
              active={activeCategory === "shipping"}
              onClick={() =>
                changeCategory("shipping")
              }
            />
          </div>
        </div>
      </section>

      {/* =========================================
          FIRST FAQ SECTION
          IMAGE LEFT / FAQ RIGHT
      ========================================= */}
      <section>
        <div
          className="
            mx-auto
            grid
            max-w-[1600px]
            grid-cols-1
            lg:grid-cols-[50%_50%]
          "
        >
          {/* LEFT IMAGE */}
          <div
            className="
              relative
              min-h-[420px]
              overflow-hidden
              bg-[#ececec]
              sm:min-h-[520px]
              lg:min-h-[720px]
            "
          >
            <img
              src={studioImage}
              alt="ABIKYA TATTOOS studio"
              className="
                absolute
                inset-0
                h-full
                w-full
                object-cover
                object-center
              "
            />

            <div className="absolute inset-0 bg-black/[0.03]" />

            <div
              className="
                absolute
                bottom-5
                left-5
                border
                border-white/30
                bg-black/30
                px-4
                py-2
                backdrop-blur-sm
              "
            >
              <p className="text-[9px] uppercase tracking-[0.18em] text-white">
                Studio image coming soon
              </p>
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div className="bg-[#f7f7f7] px-5 py-10 sm:px-8 sm:py-12 lg:px-12 lg:py-16 xl:px-16">
            <div className="mx-auto max-w-2xl">
              <p className="text-[10px] uppercase tracking-[0.2em] text-black/40">
                Frequently Asked Questions
              </p>

              <h2 className="mt-3 text-4xl tracking-tight sm:text-5xl">
                {categoryContent.title}
              </h2>

              <p className="mt-5 max-w-xl text-sm leading-7 text-black/55">
                {categoryContent.description}
              </p>

              <div className="mt-10 border-t border-black/20">
                {activeFaqs.map(
                  (faq, index) => {
                    const isOpen =
                      openQuestion === index;

                    return (
                      <div
                        key={`${activeCategory}-${faq.question}`}
                        className="border-b border-black/20"
                      >
                        <button
                          type="button"
                          onClick={() =>
                            setOpenQuestion(
                              isOpen ? null : index
                            )
                          }
                          className="
                            flex
                            w-full
                            items-center
                            justify-between
                            gap-6
                            py-6
                            text-left
                          "
                        >
                          <span className="text-base leading-6 sm:text-lg">
                            {faq.question}
                          </span>

                          <ChevronDown
                            size={19}
                            strokeWidth={1.5}
                            className={`
                              shrink-0
                              transition-transform
                              duration-300

                              ${
                                isOpen
                                  ? "rotate-180"
                                  : ""
                              }
                            `}
                          />
                        </button>

                        <div
                          className={`
                            grid
                            transition-all
                            duration-300
                            ease-out

                            ${
                              isOpen
                                ? "grid-rows-[1fr] pb-6 opacity-100"
                                : "grid-rows-[0fr] opacity-0"
                            }
                          `}
                        >
                          <div className="overflow-hidden">
                            <p className="max-w-xl text-sm leading-7 text-black/55">
                              {faq.answer}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          SECOND SECTION
          ONLINE ORDERS
          FAQ LEFT / IMAGE RIGHT
      ========================================= */}
      <section className="border-t border-black/10 bg-[#f7f7f7]">
        <div
          className="
            mx-auto
            grid
            max-w-[1600px]
            grid-cols-1
            lg:grid-cols-[50%_50%]
          "
        >
          {/* LEFT FAQ */}
          <div className="px-5 py-12 sm:px-8 sm:py-14 lg:px-12 lg:py-16 xl:px-16">
            <div className="mx-auto max-w-2xl">
              <p className="text-[10px] uppercase tracking-[0.2em] text-black/40">
                Help with your purchase
              </p>

              <h2 className="mt-3 text-4xl tracking-tight sm:text-5xl">
                ONLINE ORDERS
              </h2>

              <p className="mt-5 max-w-xl text-sm leading-7 text-black/55">
                Learn about order confirmation,
                payment, cancellations, product
                availability and support for purchases
                made through our website.
              </p>

              <div className="mt-10 border-t border-black/20">
                {onlineOrderFaqs.map(
                  (faq) => (
                    <FAQAccordionItem
                      key={faq.question}
                      question={faq.question}
                      answer={faq.answer}
                    />
                  )
                )}
              </div>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div
            className="
              relative
              min-h-[420px]
              overflow-hidden
              bg-[#ececec]

              sm:min-h-[520px]

              lg:min-h-[720px]
            "
          >
            <img
              src={studioImage}
              alt="ABIKYA online order packaging"
              className="
                absolute
                inset-0
                h-full
                w-full
                object-cover
                object-center
              "
            />

            <div className="absolute inset-0 bg-black/[0.02]" />

            <div
              className="
                absolute
                bottom-5
                right-5
                border
                border-white/30
                bg-black/25
                px-4
                py-2
                backdrop-blur-sm
              "
            >
              <p className="text-[9px] uppercase tracking-[0.18em] text-white">
                Packaging image coming soon
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          THIRD SECTION
          SHIPPING
          IMAGE LEFT / FAQ RIGHT
      ========================================= */}
      <section className="border-t border-black/10 bg-white">
        <div
          className="
            mx-auto
            grid
            max-w-[1600px]
            grid-cols-1

            lg:grid-cols-[50%_50%]
          "
        >
          {/* LEFT IMAGE */}
          <div
            className="
              relative
              min-h-[420px]
              overflow-hidden
              bg-[#ececec]

              sm:min-h-[520px]

              lg:min-h-[720px]
            "
          >
            <img
              src={studioImage}
              alt="ABIKYA shipping and delivery"
              className="
                absolute
                inset-0
                h-full
                w-full
                object-cover
                object-center
              "
            />

            <div className="absolute inset-0 bg-black/[0.03]" />

            <div
              className="
                absolute
                bottom-5
                left-5
                border
                border-white/30
                bg-black/25
                px-4
                py-2
                backdrop-blur-sm
              "
            >
              <p className="text-[9px] uppercase tracking-[0.18em] text-white">
                Shipping image coming soon
              </p>
            </div>
          </div>

          {/* RIGHT FAQ */}
          <div className="px-5 py-12 sm:px-8 sm:py-14 lg:px-12 lg:py-16 xl:px-16">
            <div className="mx-auto max-w-2xl">
              <p className="text-[10px] uppercase tracking-[0.2em] text-black/40">
                Delivery support
              </p>

              <h2 className="mt-3 text-4xl tracking-tight sm:text-5xl">
                SHIPPING
              </h2>

              <p className="mt-5 max-w-xl text-sm leading-7 text-black/55">
                Learn about delivery timelines,
                shipping options, tracking, delays and
                other shipment-related questions.
              </p>

              <div className="mt-10 border-t border-black/20">
                {shippingFaqs.map(
                  (faq) => (
                    <FAQAccordionItem
                      key={faq.question}
                      question={faq.question}
                      answer={faq.answer}
                    />
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          CONTACT CTA
      ========================================= */}
      <section className="border-t border-white/10 bg-black text-white">
        <div
          className="
            mx-auto
            flex
            max-w-[1600px]
            flex-col
            gap-6
            px-5
            py-12

            sm:px-8

            md:flex-row
            md:items-center
            md:justify-between

            lg:px-16
          "
        >
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/45">
              Still need help?
            </p>

            <h2 className="mt-2 text-2xl tracking-tight sm:text-3xl">
              TALK TO OUR TEAM
            </h2>

            <p className="mt-2 text-sm text-white/50">
              Contact ABIKYA TATTOOS and we’ll help
              with your enquiry.
            </p>
          </div>

          <a
            href="/contact"
            style={{
              color: "#000000",
            }}
            className="
              inline-flex
              min-h-[54px]
              w-fit
              items-center
              justify-center

              bg-white
              px-8

              text-[10px]
              font-medium
              uppercase
              tracking-[0.16em]

              transition-all
              duration-300

              hover:bg-[#e9e9e9]
            "
          >
            <span
              style={{
                color: "#000000",
              }}
            >
              CONTACT US
            </span>
          </a>
        </div>
      </section>
    </div>
  );
}

/* =========================================
   TOP CATEGORY TAB
========================================= */

type FAQTabProps = {
  label: string;
  active: boolean;
  onClick: () => void;
};

function FAQTab({
  label,
  active,
  onClick,
}: FAQTabProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        min-h-[48px]
        border
        px-6

        text-[10px]
        font-medium
        uppercase
        tracking-[0.15em]

        transition-all
        duration-300

        ${
          active
            ? "border-black bg-black text-white"
            : "border-black/10 bg-[#f4f4f4] text-black hover:border-black/40 hover:bg-white"
        }
      `}
    >
      {label}
    </button>
  );
}

/* =========================================
   REUSABLE FAQ ACCORDION
========================================= */

function FAQAccordionItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-black/20">
      <button
        type="button"
        onClick={() =>
          setOpen((prev) => !prev)
        }
        className="
          flex
          w-full
          items-center
          justify-between
          gap-6
          py-6
          text-left
        "
      >
        <span className="text-base leading-6 text-black sm:text-lg">
          {question}
        </span>

        <ChevronDown
          size={19}
          strokeWidth={1.5}
          className={`
            shrink-0
            transition-transform
            duration-300

            ${open ? "rotate-180" : ""}
          `}
        />
      </button>

      <div
        className={`
          grid
          transition-all
          duration-300
          ease-out

          ${
            open
              ? "grid-rows-[1fr] pb-6 opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }
        `}
      >
        <div className="overflow-hidden">
          <p className="max-w-xl text-sm leading-7 text-black/55">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export default FAQ;