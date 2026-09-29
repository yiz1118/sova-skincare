"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ShoppingBag, X } from "@/components/icons";
import { useCart } from "@/components/cart-provider";
import { useEffect, useRef, useState } from "react";
const links = [{href:"/shop",label:"Shop"},{href:"/routine",label:"Your routine"},{href:"/ingredients",label:"Ingredients"},{href:"/philosophy",label:"Philosophy"},{href:"/about",label:"About"}];
export function SiteHeader() {
  const {count} = useCart(); const [open,setOpen] = useState(false); const firstLink = useRef<HTMLAnchorElement>(null); const menuButton = useRef<HTMLButtonElement>(null); const pathname=usePathname();
  useEffect(()=>{ if(!open) return; const frame=requestAnimationFrame(()=>firstLink.current?.focus()); const handle=(event:KeyboardEvent)=>{if(event.key==="Escape"){setOpen(false);menuButton.current?.focus();}}; document.addEventListener("keydown",handle); return ()=>{cancelAnimationFrame(frame);document.removeEventListener("keydown",handle);}; },[open]);
  return <><div className="announcement">Daily care, thoughtfully composed. <span>·</span> Concept Project</div><header className="site-header"><div className="header-inner"><button ref={menuButton} className="menu-toggle" type="button" aria-label={open?"Close menu":"Open menu"} aria-expanded={open} aria-controls="mobile-navigation" onClick={()=>setOpen(value=>!value)}>{open?<X size={23}/>:<Menu size={23}/>}</button><Link href="/" className="wordmark" aria-label="SOVA home" onClick={()=>setOpen(false)}>SOVA<span className="wordmark-dot">.</span></Link><nav className="desktop-nav" aria-label="Primary navigation">{links.map(link=><Link key={link.href} href={link.href} aria-current={pathname===link.href?"page":undefined}>{link.label}</Link>)}</nav><Link href="/cart" className="bag-link" aria-label={`Bag, ${count} items`}><ShoppingBag size={19} strokeWidth={1.5}/><span>Bag ({count})</span></Link></div><nav id="mobile-navigation" className={`mobile-nav ${open?"is-open":""}`} aria-label="Mobile navigation" aria-hidden={!open}>{links.map((link,index)=><Link key={link.href} ref={index===0?firstLink:undefined} href={link.href} onClick={()=>setOpen(false)} tabIndex={open?0:-1} aria-current={pathname===link.href?"page":undefined}>{link.label}</Link>)}</nav></header></>;
}
