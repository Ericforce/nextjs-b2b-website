import ContactForm from "@/components/contact/contact-form";

export default function ContactSection() {
  return (
    <section className="contact" aria-labelledby="contact-section-heading">
      <div className="container">
        <div className="contact__content">
          <aside className="contact__aside">
            <h2 id="contact-section-heading">Tell us about your project</h2>
            <p>
              Complete the form and our team will follow up promptly with next steps.
              We typically respond within one business day. If you prefer, email us directly at {" "}
              <a href="mailto:hello@example.com" className="link">hello@example.com</a>.
            </p>
          </aside>
          <div className="contact__form-wrapper">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
