function Shipping() {
  return (
    <div className="w-full bg-[#f7f7f7] text-black">
      {/* PAGE HEADER */}
      <section className="border-b border-black/10 bg-white">
        <div className="mx-auto max-w-[1600px] px-5 py-14 text-center sm:px-8 lg:px-16 lg:py-20">
          <p className="text-[10px] uppercase tracking-[0.22em] text-black/40">
            Support
          </p>

          <h1 className="mt-3 text-4xl tracking-tight sm:text-5xl lg:text-6xl">
            SHIPPING POLICY
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-black/50">
            Everything you need to know about order processing, shipping and
            delivery at ABIKYATATTOOS.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section>
        <div className="mx-auto max-w-[900px] px-5 py-12 sm:px-8 lg:py-16">
          <LegalSection title="1. Overview">
            <p>
              This Shipping Policy explains how orders placed through the
              ABIKYATATTOOS website are processed, dispatched and delivered.
            </p>

            <p>
              Shipping timelines, charges and availability may vary depending
              on the delivery location, product availability and courier
              services.
            </p>
          </LegalSection>

          <LegalSection title="2. Order Processing">
            <p>
              Orders are generally processed after successful payment
              confirmation and order verification.
            </p>

            <p>
              Processing times may vary during weekends, public holidays,
              promotional periods or periods of high order volume.
            </p>
          </LegalSection>

          <LegalSection title="3. Shipping Locations">
            <p>
              We currently ship to locations supported by our available courier
              and delivery partners.
            </p>

            <p>
              Some areas may have limited delivery availability or require
              additional shipping time.
            </p>
          </LegalSection>

          <LegalSection title="4. Shipping Charges">
            <p>
              Applicable shipping charges will be displayed during checkout
              before your order is confirmed.
            </p>

            <p>
              Free shipping may be offered on eligible orders based on order
              value, payment method, promotional campaigns or other conditions.
            </p>
          </LegalSection>

          <LegalSection title="5. Free Shipping Offers">
            <p>
              Free shipping promotions may be subject to minimum order values,
              prepaid payment requirements or other promotional conditions.
            </p>

            <p>
              Any such conditions will be displayed on the website or during
              checkout where applicable.
            </p>
          </LegalSection>

          <LegalSection title="6. Estimated Delivery Time">
            <p>
              Estimated delivery timelines begin after an order has been
              processed and dispatched.
            </p>

            <p>
              Delivery times are estimates only and may vary depending on the
              destination, courier partner, weather, public holidays or other
              circumstances outside our reasonable control.
            </p>
          </LegalSection>

          <LegalSection title="7. Order Tracking">
            <p>
              Once your order has been dispatched, tracking information may be
              shared through the contact details provided during checkout.
            </p>

            <p>
              Tracking updates are provided by the relevant delivery partner and
              may take some time to appear after dispatch.
            </p>
          </LegalSection>

          <LegalSection title="8. Delivery Address">
            <p>
              Customers are responsible for providing a complete and accurate
              shipping address, contact number and any other information
              required for successful delivery.
            </p>

            <p>
              We may not be able to modify the delivery address after an order
              has been dispatched.
            </p>
          </LegalSection>

          <LegalSection title="9. Failed Delivery Attempts">
            <p>
              If a delivery attempt is unsuccessful, the courier partner may
              attempt redelivery or contact the customer for additional
              instructions.
            </p>

            <p>
              Orders returned to us because of repeated failed delivery
              attempts, an incorrect address or refusal of delivery may be
              subject to additional shipping charges if reshipment is requested.
            </p>
          </LegalSection>

          <LegalSection title="10. Delayed Shipments">
            <p>
              While we aim to dispatch and deliver orders within the estimated
              timeframe, delays may occasionally occur due to courier issues,
              weather, public holidays, operational disruptions or other
              circumstances beyond our control.
            </p>

            <p>
              If your shipment appears significantly delayed, please contact our
              support team with your order details.
            </p>
          </LegalSection>

          <LegalSection title="11. Lost Shipments">
            <p>
              If tracking information indicates that a shipment may be lost,
              please contact us so that the issue can be reviewed with the
              relevant courier partner.
            </p>

            <p>
              Any replacement, refund or other resolution will depend on the
              circumstances and outcome of the delivery investigation.
            </p>
          </LegalSection>

          <LegalSection title="12. Damaged Packages">
            <p>
              If a package arrives visibly damaged, please document the
              condition of the parcel and contact us as soon as possible.
            </p>

            <p>
              Photographs or other information may be requested to help us
              review the issue.
            </p>
          </LegalSection>

          <LegalSection title="13. Incorrect or Missing Items">
            <p>
              If you receive an incorrect product or believe an item is missing
              from your order, please contact our support team with your order
              details.
            </p>

            <p>
              We may request photographs of the received package and products
              before arranging a resolution.
            </p>
          </LegalSection>

          <LegalSection title="14. International Shipping">
            <p>
              International shipping, if available, may be subject to additional
              delivery charges, customs requirements, duties or taxes.
            </p>

            <p>
              Any international shipping terms will be displayed during
              checkout where applicable.
            </p>
          </LegalSection>

          <LegalSection title="15. Customs & Duties">
            <p>
              Where international delivery is available, customs duties, import
              taxes and related charges may be the responsibility of the
              customer unless otherwise stated.
            </p>
          </LegalSection>

          <LegalSection title="16. Changes to Shipping Policy">
            <p>
              We may update this Shipping Policy from time to time to reflect
              changes in courier services, delivery coverage, pricing or
              operational requirements.
            </p>
          </LegalSection>

          <LegalSection title="17. Contact Us">
            <p>
              If you have questions regarding shipping, tracking or delivery,
              please contact ABIKYATATTOOS through our Contact page.
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

export default Shipping;