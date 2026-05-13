import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import "./ContactPanel.css";

const SOCIALS = [
  { label: "Twitter / X",  href: "#", handle: "@TheHeistSyndicate" },
  { label: "Discord",      href: "#", handle: "discord.gg/heistsyn" },
  { label: "Instagram",    href: "#", handle: "@heistsyndicate"      },
  { label: "YouTube",      href: "#", handle: "The Heist Syndicate"  },
];

export default function ContactPanel({ isActive }) {
  const rootRef = useRef(null);
  const [sent, setSent] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSent(true);
  }

  useGSAP(() => {
    if (!isActive) return;
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(".contact-eyebrow",
      { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.55 }, 0.05);
    tl.fromTo(".contact-accent",
      { scaleX: 0, transformOrigin: "left center" },
      { scaleX: 1, duration: 0.55 }, 0.15);
    tl.fromTo(".contact-title",
      { opacity: 0, y: 28, skewX: -2 },
      { opacity: 1, y: 0, skewX: 0, duration: 0.8 }, 0.2);
    tl.fromTo(".contact-body",
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.65 }, 0.35);
    tl.fromTo(".contact-field, .contact-submit",
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.55, stagger: 0.07 }, 0.4);
    tl.fromTo(".contact-socials-wrap",
      { opacity: 0, x: 30 },
      { opacity: 1, x: 0, duration: 0.7 }, 0.3);
    tl.fromTo(".contact-social",
      { opacity: 0, x: 16 },
      { opacity: 1, x: 0, duration: 0.45, stagger: 0.07 }, 0.55);
  }, { dependencies: [isActive], scope: rootRef });

  return (
    <section className="panel contact-panel" ref={rootRef}>
      <div className="contact-inner">
        <div className="contact-form-wrap">
          <p className="section-eyebrow contact-eyebrow">Get in Touch</p>
          <span className="accent-line contact-accent" />
          <h2 className="section-title contact-title">Join the <span>Heist</span></h2>
          <p className="section-body contact-body">
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
