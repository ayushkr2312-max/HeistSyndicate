import { useState } from "react";
import "./ContactPanel.css";

const SOCIALS = [
  { label: "Twitter / X",  href: "#", handle: "@TheHeistSyndicate" },
  { label: "Discord",      href: "#", handle: "discord.gg/heistsyn" },
  { label: "Instagram",    href: "#", handle: "@heistsyndicate"      },
  { label: "YouTube",      href: "#", handle: "The Heist Syndicate"  },
];

export default function ContactPanel() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <section className="panel contact-panel">
      <div className="contact-inner">
        {/* Left: form */}
        <div className="contact-form-wrap">
          <p className="section-eyebrow">Get in Touch</p>
          <span className="accent-line" />
          <h2 className="section-title">Join the <span>Heist</span></h2>
          <p className="section-body">
            Want to try out, partner up, or just talk strategy? Drop us a
            message and we'll get back to you within 48 hours.
          </p>

          {sent ? (
            <div className="contact-success">
              <span className="contact-success__icon">✓</span>
              <p>Message received. We'll be in touch.</p>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              <div className="contact-form__row">
                <div className="contact-field">
                  <label htmlFor="cf-name">Name</label>
                  <input id="cf-name" type="text" placeholder="Your name" required />
                </div>
                <div className="contact-field">
                  <label htmlFor="cf-email">Email</label>
                  <input id="cf-email" type="email" placeholder="you@example.com" required />
                </div>
              </div>
              <div className="contact-field">
                <label htmlFor="cf-subject">Subject</label>
                <input id="cf-subject" type="text" placeholder="Tryout / Partnership / Other" />
              </div>
              <div className="contact-field">
                <label htmlFor="cf-msg">Message</label>
                <textarea id="cf-msg" rows={4} placeholder="Tell us about yourself…" required />
              </div>
              <button type="submit" className="contact-submit">
                Send Message
                <span className="contact-submit__arrow" aria-hidden="true">→</span>
              </button>
            </form>
          )}
        </div>

        {/* Right: socials */}
        <div className="contact-socials-wrap">
          <p className="contact-socials-title">Find Us Online</p>
          <ul className="contact-socials">
            {SOCIALS.map((s) => (
              <li key={s.label} className="contact-social">
                <a href={s.href} className="contact-social__link">
                  <span className="contact-social__label">{s.label}</span>
                  <span className="contact-social__handle">{s.handle}</span>
                  <span className="contact-social__arrow" aria-hidden="true">↗</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="contact-divider" aria-hidden="true" />
    </section>
  );
}
