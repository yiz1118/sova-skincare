import type { Metadata } from "next"; import { CartClient } from "@/components/cart-client";
export const metadata:Metadata={title:"Your Bag",description:"Review your SOVA concept bag and preview the demo checkout."};
export default function Cart(){return <main id="main" className="inner-page cart-page"><div className="page-hero"><span className="eyebrow">SOVA / Your bag</span><div><h1>Your daily <em>care edit.</em></h1><p>Review your choices. This storefront is a design demonstration.</p></div><span className="page-index">BAG / DEMO</span></div><CartClient/></main>}
