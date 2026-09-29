import Link from "next/link";
import { CreatorCredit } from "@/components/creator-credit";
import { conceptProject } from "@/config/creator";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div>
          <Link href="/" className="footer-logo">SOVA.</Link>
          <p>Daily care, thoughtfully composed.</p>
        </div>
        <nav aria-label="Footer navigation">
          <Link href="/shop">Shop all</Link>
          <Link href="/routine">Find your routine</Link>
          <Link href="/ingredients">Ingredients</Link>
          <Link href="/philosophy">Philosophy</Link>
          <Link href="/about">About the concept</Link>
          <Link href="/cart">Your bag</Link>
        </nav>
      </div>
      <CreatorCredit />
      <div className="footer-bottom">
        <span>© 2026 SOVA · {conceptProject.status}</span>
        <p>This is a fictional portfolio concept. Products, formulations, and transactions are demonstrations. No purchase is possible.</p>
      </div>
    </footer>
  );
}
