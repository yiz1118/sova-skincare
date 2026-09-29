import { productById } from "@/data/catalog";
export type CartLine = { id:string; quantity:number };
export const CART_KEY = "sova-cart-v1";
export const MAX_QUANTITY = 20;
export function sanitizeCart(value:unknown):CartLine[] {
  if(!value || typeof value !== "object" || (value as {version?:unknown}).version !== 1 || !Array.isArray((value as {items?:unknown}).items)) return [];
  const merged = new Map<string,number>();
  for(const item of (value as {items:unknown[]}).items) {
    if(!item || typeof item !== "object") continue;
    const {id,quantity} = item as Record<string,unknown>;
    if(typeof id !== "string" || !productById(id) || !Number.isInteger(quantity) || (quantity as number) <= 0) continue;
    merged.set(id,Math.min(MAX_QUANTITY,(merged.get(id) ?? 0) + (quantity as number)));
  }
  return [...merged].map(([id,quantity]) => ({id,quantity}));
}
export function addItems(lines:CartLine[], additions:CartLine[]):CartLine[] { return sanitizeCart({version:1,items:[...lines,...additions]}); }
export function setQuantity(lines:CartLine[], id:string, quantity:number):CartLine[] {
  if(!productById(id)) return lines;
  if(!Number.isInteger(quantity)) return lines;
  if(quantity <= 0) return lines.filter(line => line.id !== id);
  return sanitizeCart({version:1,items:lines.filter(line=>line.id!==id).concat({id,quantity:Math.min(quantity,MAX_QUANTITY)})});
}
export function subtotal(lines:CartLine[]) { return lines.reduce((sum,line)=>sum + (productById(line.id)?.priceCents ?? 0)*line.quantity,0); }
