import assert from "node:assert/strict";
import test from "node:test";
import { buildRoutine, Preference, Priority, SkinFeel } from "../lib/routine";
import { addItems, sanitizeCart, setQuantity, subtotal } from "../lib/cart";

test("all routine combinations keep the correct order and optional evening mask",()=>{
  const feels:SkinFeel[]=["dry","balanced","oily"];
  const preferences:Preference[]=["essential","extended"];
  const priorities:Priority[]=["hydration","tone","texture"];
  let cases=0;
  for(const feel of feels)for(const preference of preferences)for(const priority of priorities){
    const ids=buildRoutine({feel,preference,priority}).map(step=>step.id);
    assert.equal(ids[0],"cleanser");
    assert.equal(ids.includes("moisturizer"),true);
    assert.equal(ids.indexOf("cleanser")<ids.indexOf("moisturizer"),true);
    if(preference==="essential")assert.deepEqual(ids,["cleanser","moisturizer"]);
    else {assert.equal(ids[1],priority==="tone"?"even":"dew");assert.equal(ids.includes("mask"),feel==="dry");}
    cases++;
  }
  assert.equal(cases,18);
});
test("cart merges duplicates, uses catalog prices and caps quantities",()=>{
  const lines=addItems([{id:"cleanser",quantity:2}],[{id:"cleanser",quantity:3},{id:"dew",quantity:1}]);
  assert.deepEqual(lines,[{id:"cleanser",quantity:5},{id:"dew",quantity:1}]);
  assert.equal(subtotal(lines),5*2600+4200);
  assert.deepEqual(addItems(lines,[{id:"cleanser",quantity:50}])[0],{id:"cleanser",quantity:20});
  assert.deepEqual(setQuantity(lines,"cleanser",0),[{id:"dew",quantity:1}]);
});
test("cart rejects invalid or stale storage without trusting stored prices",()=>{
  assert.deepEqual(sanitizeCart({version:2,items:[{id:"cleanser",quantity:1}]}),[]);
  assert.deepEqual(sanitizeCart({version:1,items:[{id:"bad",quantity:1},{id:"cleanser",quantity:-1},{id:"dew",quantity:2,priceCents:1}]}),[{id:"dew",quantity:2}]);
  assert.equal(subtotal(sanitizeCart({version:1,items:[{id:"dew",quantity:2,priceCents:1}]})),8400);
  assert.deepEqual(setQuantity([{id:"dew",quantity:1}],"dew",Number.NaN),[{id:"dew",quantity:1}]);
});
