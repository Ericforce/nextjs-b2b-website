import ContactSection from "@/components/contact/contact-section";

export default function HomePage() {
  return (
    <main className="page">
      <section className="hero" aria-labelledby="contact-heading">
        <div className="container">
          <h1 id="contact-heading" className="hero__title">
            We would love to hear from you
          </h1>
          <p className="hero__subtitle">
            Share a bit about your project and our team will respond within one business day.
          </p>
        </div>
      </section>
      <ContactSection />
    </main>
  );
}
