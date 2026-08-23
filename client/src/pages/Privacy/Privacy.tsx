function Terms() {
  return (
    <div className="w-full bg-[#f7f7f7] text-black">
      {/* PAGE HEADER */}
      <section className="border-b border-black/10 bg-white">
        <div className="mx-auto max-w-[1600px] px-5 py-14 text-center sm:px-8 lg:px-16 lg:py-20">
          <p className="text-[10px] uppercase tracking-[0.22em] text-black/40">
            Legal
          </p>

          <h1 className="mt-3 text-4xl tracking-tight sm:text-5xl lg:text-6xl">
            TERMS OF SERVICE
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-black/50">
            Please review these terms carefully before using our website or
            purchasing from ABIKYATATTOOS.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section>
        <div className="mx-auto max-w-[900px] px-5 py-12 sm:px-8 lg:py-16">
          <LegalSection title="1. Overview">
            <p>
              This website is operated by ABIKYATATTOOS. Throughout the site,
              the terms “we”, “us” and “our” refer to ABIKYATATTOOS.
            </p>

            <p>
              By accessing this website or purchasing from us, you agree to be
              bound by these Terms of Service and any additional policies made
              available on this website.
            </p>
          </LegalSection>

          <LegalSection title="2. Online Store Terms">
            <p>
              You may not use our products or services for any unlawful or
              unauthorized purpose.
            </p>

            <p>
              You agree not to reproduce, duplicate, copy, sell, resell or
              exploit any portion of the website without written permission.
            </p>
          </LegalSection>

          <LegalSection title="3. Products & Availability">
            <p>
              Product descriptions, pricing, availability and imagery may be
              updated from time to time.
            </p>

            <p>
              We reserve the right to limit quantities, discontinue products,
              or refuse an order where reasonably necessary.
            </p>
          </LegalSection>

          <LegalSection title="4. Pricing">
            <p>
              All prices shown on the website are subject to change without
              prior notice.
            </p>

            <p>
              Promotional pricing, discounts and special offers may be
              available for limited periods and may be subject to additional
              conditions.
            </p>
          </LegalSection>

          <LegalSection title="5. Orders & Payments">
            <p>
              By placing an order, you confirm that the information provided by
              you is accurate and complete.
            </p>

            <p>
              Orders may be accepted, rejected or cancelled where necessary,
              including cases involving payment issues, pricing errors or stock
              availability.
            </p>
          </LegalSection>

          <LegalSection title="6. Shipping">
            <p>
              Shipping timelines are estimates and may vary based on location,
              courier availability and external circumstances.
            </p>

            <p>
              Full shipping terms will be provided in our Shipping Policy.
            </p>
          </LegalSection>

          <LegalSection title="7. Returns & Refunds">
            <p>
              Returns and refunds are subject to our applicable return policy,
              including hygiene and product-condition requirements.
            </p>

            <p>
              Certain jewellery items may be non-returnable for hygiene reasons.
              Final eligibility will be outlined in the Returns Policy.
            </p>
          </LegalSection>

          <LegalSection title="8. Personal Information">
            <p>
              Personal information submitted through this website is handled in
              accordance with our Privacy Policy.
            </p>
          </LegalSection>

          <LegalSection title="9. Intellectual Property">
            <p>
              Website content, branding, graphics, product imagery, text and
              design elements remain the property of ABIKYATATTOOS or their
              respective owners.
            </p>
          </LegalSection>

          <LegalSection title="10. Limitation of Liability">
            <p>
              To the maximum extent permitted by law, ABIKYATATTOOS will not be
              responsible for indirect, incidental or consequential losses
              arising from use of this website or products.
            </p>
          </LegalSection>

          <LegalSection title="11. Changes to These Terms">
            <p>
              We may update these Terms of Service from time to time. Updated
              terms will become effective when posted on this website.
            </p>
          </LegalSection>

          <LegalSection title="12. Contact">
            <p>
              Questions about these Terms of Service can be sent through our
              Contact page.
            </p>
          </LegalSection>

          {/* UPDATED DATE */}
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

export default Terms;