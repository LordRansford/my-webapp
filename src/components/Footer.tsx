"use client";

import Link from "next/link";
import DonateButton from "@/components/donations/DonateButton";
import BrandLogo from "@/components/BrandLogo";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div>
          <div style={{ marginBottom: "0.75rem" }} aria-label="Ransford’s Notes logo">
            <BrandLogo className="h-12 w-auto text-slate-900" />
          </div>
          <p className="eyebrow">Ransford Chung Amponsah</p>
          <p className="muted">
            I build notes and browser labs for data, digitalisation, AI, cybersecurity, and engineering. I try to keep it clear,
            accurate, and practical.
          </p>
          <p className="muted">
            CPD: designed to support self-directed CPD with clear objectives, conservative hour estimates, and evidence-friendly outputs.
          </p>
        </div>
        <div className="footer-links" aria-label="Footer">
          <Link href="/courses">Start learning</Link>
          <Link href="/tools">Explore the platform</Link>
          <Link href="/tools">Tools</Link>
          <Link href="/templates">Templates</Link>
          <Link href="/studios">Studios</Link>
          <Link href="/dashboards">Dashboards</Link>
          <Link href="/cpd">CPD</Link>
          <Link href="/play">Play</Link>
          <Link href="/support">Support</Link>
          <Link href="/about">About</Link>
          <Link href="/trust-and-about">Trust and credibility</Link>
          <Link href="/accreditation-and-alignment">Accreditation</Link>
          <Link href="/subscribe">Subscribe</Link>
          <DonateButton />
          <Link href="/contact">Contact</Link>
          <a href="mailto:hello@ransfordsnotes.example">hello@ransfordsnotes.example</a>
          <Link href="/accessibility">Accessibility</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </div>
      </div>
    </footer>
  );
}


