export default function Contact({ onSubmit, status, submitting }) {
  return (
    <section id="contact" className="section">
      <h2>Contact <span>Me</span></h2>
      <form className="contact-form" onSubmit={onSubmit}>
        <input type="text" name="name" placeholder="Your Name" required />
        <input type="email" name="email" placeholder="Your Email" required />
        <input type="text" name="subject" placeholder="Subject" />
        <textarea name="message" placeholder="Your Message" required></textarea>
        <button type="submit" className="btn" disabled={submitting}>
          {submitting ? "Sending..." : "Send Message"}
        </button>
        {status.message && (
          <p role={status.type === "error" ? "alert" : "status"}>
            {status.message}
          </p>
        )}
      </form>
    </section>
  );
}