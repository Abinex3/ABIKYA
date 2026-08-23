function Returns() {
  return (
    <div className="w-full bg-[#f7f7f7] text-black">
      {/* PAGE HEADER */}
      <section className="border-b border-black/10 bg-white">
        <div className="mx-auto max-w-[1600px] px-5 py-14 text-center sm:px-8 lg:px-16 lg:py-20">
          <p className="text-[10px] uppercase tracking-[0.22em] text-black/40">
            Support
          </p>

          <h1 className="mt-3 text-4xl tracking-tight sm:text-5xl lg:text-6xl">
            RETURNS & REFUNDS
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-black/50">
            Please review our return and refund guidelines before requesting a
            return or exchange.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section>
        <div className="mx-auto max-w-[900px] px-5 py-12 sm:px-8 lg:py-16">
          <LegalSection title="1. Overview">
            <p>
              We want you to be happy with your ABIKYATATTOOS purchase. If
              there is an issue with your order, please contact us within the
              applicable return period.
            </p>

            <p>
              All return and refund requests are subject to the conditions
              outlined below.
            </p>
          </LegalSection>

          <LegalSection title="2. Return Eligibility">
            <p>
              Eligible products may be returned within the return period stated
              on our website, provided they are unused, unworn and returned in
              their original condition and packaging.
            </p>

            <p>
              Products must not show signs of wear, damage, alteration or misuse.
            </p>
          </LegalSection>

          <LegalSection title="3. Hygiene Restrictions">
            <p>
              Due to hygiene and safety considerations, certain piercing
              jewellery may not be eligible for return once opened, tried on or
              worn.
            </p>

            <p>
              Eligibility for return may depend on the type of product and its
              condition when received by us.
            </p>
          </LegalSection>

          <LegalSection title="4. Non-Returnable Items">
            <p>
              Certain items may be excluded from returns, including used
              jewellery, personalized products, damaged items caused after
              delivery and products marked as final sale.
            </p>

            <p>
              Promotional or discounted products may also be subject to special
              return conditions where stated.
            </p>
          </LegalSection>

          <LegalSection title="5. Damaged or Incorrect Orders">
            <p>
              If your order arrives damaged, defective or incorrect, please
              contact us as soon as possible after delivery.
            </p>

            <p>
              We may request photographs, packaging details or other information
              to verify the issue before approving a replacement or refund.
            </p>
          </LegalSection>

          <LegalSection title="6. Return Request Process">
            <p>
              To request a return, contact our support team through the Contact
              page and provide your order details along with the reason for the
              request.
            </p>

            <p>
              Do not send products back until your return request has been
              reviewed and return instructions have been provided.
            </p>
          </LegalSection>

          <LegalSection title="7. Return Shipping">
            <p>
              Return shipping charges may be the responsibility of the customer
              unless the product was received damaged, defective or incorrect.
            </p>

            <p>
              We recommend using a trackable shipping method when returning an
              item, as we cannot be responsible for return parcels lost during
              transit.
            </p>
          </LegalSection>

          <LegalSection title="8. Inspection of Returned Items">
            <p>
              Returned products may be inspected before a refund or exchange is
              approved.
            </p>

            <p>
              If an item does not meet the return conditions, the return may be
              rejected and the product may be sent back to the customer.
            </p>
          </LegalSection>

          <LegalSection title="9. Refunds">
            <p>
              Once an approved return has been received and inspected, the
              applicable refund will be processed to the original payment
              method.
            </p>

            <p>
              Refund processing times may vary depending on the payment provider
              or financial institution.
            </p>
          </LegalSection>

          <LegalSection title="10. Shipping Charges">
            <p>
              Original shipping charges may be non-refundable unless the return
              is due to an error on our part or a defective product.
            </p>
          </LegalSection>

          <LegalSection title="11. Exchanges">
            <p>
              Exchanges may be available for eligible products depending on
              stock availability.
            </p>

            <p>
              If the requested replacement item is unavailable, a refund or
              alternative solution may be offered.
            </p>
          </LegalSection>

          <LegalSection title="12. Cancellation Before Dispatch">
            <p>
              Orders may be eligible for cancellation before dispatch. Once an
              order has been shipped, cancellation may no longer be possible.
            </p>

            <p>
              Please contact us promptly if you need to request an order
              cancellation.
            </p>
          </LegalSection>

          <LegalSection title="13. Sale & Promotional Items">
            <p>
              Sale, clearance or promotional products may have different return
              conditions. Any special restrictions will be communicated on the
              relevant product or promotional page where applicable.
            </p>
          </LegalSection>

          <LegalSection title="14. Refund Delays">
            <p>
              If an approved refund has not appeared after the expected
              processing period, please first check with your payment provider
              or bank.
            </p>

            <p>
              If the issue remains unresolved, contact our support team with
              your order details.
            </p>
          </LegalSection>

          <LegalSection title="15. Contact Us">
            <p>
              For questions about returns, exchanges or refunds, please contact
              ABIKYATATTOOS through our Contact page.
            </p>
          </LegalSection>

          {/* LAST UPDATED */}
          <div className="mt-14 border-t border-black/10 pt-6">
            <p className="text-[10px] uppercase tracking-[0.16em] text-black/40">
              Last updated: August 2026
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

type LegalSectionProps = {
  title: string;
  children: React.ReactNode;
};

function LegalSection({
  title,
  children,
}: LegalSectionProps) {
  return (
    <section className="border-b border-black/10 py-8 first:pt-0">
      <h2 className="text-lg font-medium tracking-tight sm:text-xl">
        {title}
      </h2>

      <div className="mt-4 space-y-4 text-sm leading-7 text-black/65 sm:text-[15px]">
        {children}
      </div>
    </section>
  );
}

export default Returns;