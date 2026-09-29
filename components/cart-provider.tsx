"use client";
import { createContext, useCallback, useContext, useMemo, useState, useSyncExternalStore } from "react";
import { addItems, CART_KEY, CartLine, sanitizeCart, setQuantity as setLineQuantity } from "@/lib/cart";

type CartContextValue = { lines:CartLine[]; count:number; notice:string; add:(id:string,quantity?:number)=>void; addMany:(ids:string[])=>void; update:(id:string,quantity:number)=>void; clear:()=>void };
const CartContext = createContext<CartContextValue | null>(null);
let memoryCart = "";
const changeEvent = "sova-cart-change";
function snapshot(){try{return window.localStorage.getItem(CART_KEY) ?? memoryCart;}catch{return memoryCart;}}
function subscribe(callback:()=>void){window.addEventListener(changeEvent,callback);window.addEventListener("storage",callback);return()=>{window.removeEventListener(changeEvent,callback);window.removeEventListener("storage",callback);};}
function save(lines:CartLine[]){memoryCart=JSON.stringify({version:1,items:lines});try{window.localStorage.setItem(CART_KEY,memoryCart);}catch{/* in-memory bag remains usable */}window.dispatchEvent(new Event(changeEvent));}
export function CartProvider({children}:{children:React.ReactNode}) {
  const raw = useSyncExternalStore(subscribe,snapshot,()=>"");
  const lines=useMemo(()=>{try{return sanitizeCart(JSON.parse(raw));}catch{return [];}},[raw]);
  const [notice,setNotice] = useState("");
  const add = useCallback((id:string,quantity=1) => { save(addItems(lines,[{id,quantity}])); setNotice("Added to bag"); },[lines]);
  const addMany = useCallback((ids:string[]) => { save(addItems(lines,ids.map(id=>({id,quantity:1})))); setNotice("Routine added to bag"); },[lines]);
  const update = useCallback((id:string,quantity:number) => { save(setLineQuantity(lines,id,quantity)); setNotice(quantity<=0?"Removed from bag":"Bag updated"); },[lines]);
  const clear = useCallback(() => { save([]); setNotice("Demo checkout complete. No order or payment was placed."); },[]);
  return <CartContext.Provider value={{lines,count:lines.reduce((n,line)=>n+line.quantity,0),notice,add,addMany,update,clear}}>{children}<span className="sr-only" role="status" aria-live="polite">{notice}</span></CartContext.Provider>;
}
export function useCart() { const context = useContext(CartContext); if(!context) throw new Error("CartProvider missing"); return context; }
