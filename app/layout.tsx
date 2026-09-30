import type { Metadata } from "next";
import "@fontsource/dm-sans/400.css"; import "@fontsource/dm-sans/500.css"; import "@fontsource/dm-sans/600.css"; import "@fontsource/instrument-serif/400.css"; import "@fontsource/instrument-serif/400-italic.css";
import "./globals.css";
import { CartProvider } from "@/components/cart-provider"; import { SiteHeader } from "@/components/site-header"; import { SiteFooter } from "@/components/site-footer";
import { ScrollReveals } from "@/components/scroll-reveals";
import { creator, conceptProject } from "@/config/creator";
export const metadata:Metadata={title:{default:"SOVA — Daily care, thoughtfully composed",template:"%s | SOVA"},description:`${conceptProject.name} is an independent skincare concept website designed and developed by ${creator.name}. Explore fictional daily care, ingredients, and a simple routine builder.`,robots:{index:false,follow:false}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><CartProvider><a className="skip-link" href="#main">Skip to content</a><SiteHeader/>{children}<SiteFooter/><ScrollReveals/></CartProvider></body></html>}
