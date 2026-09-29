import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { products } from "../../data/catalog";

test("shop, product detail, bag and demo checkout",async({page})=>{
  await page.goto("/shop");
  await expect(page.getByRole("status").filter({hasText:"Showing 6 products"})).toBeVisible();
  await page.getByRole("button",{name:"Serum",exact:true}).click();
  await expect(page).toHaveURL(/category=Serum/);
  await expect(page.getByRole("status").filter({hasText:"Showing 2 products"})).toBeVisible();
  await page.getByLabel("Sort by").selectOption("price-low");
  await expect(page).toHaveURL(/sort=price-low/);
  await expect(page.locator(".shop-grid .product-card").first()).toContainText("Dew Point Hydrating Serum");
  await page.getByRole("link",{name:"View Dew Point Hydrating Serum"}).click();
  await expect(page.getByRole("heading",{name:"Dew Point Hydrating Serum",level:1})).toBeVisible();
  await page.getByRole("button",{name:"Show image 2"}).click();
  await expect(page.getByRole("button",{name:"Show image 2"})).toHaveAttribute("aria-pressed","true");
  await page.getByRole("button",{name:"Increase quantity"}).click();
  await page.getByRole("button",{name:/Add to bag —/}).click();
  await page.getByRole("link",{name:/Bag, 2 items/}).click();
  await expect(page.getByText("$84",{exact:true}).first()).toBeVisible();
  await page.reload();
  await expect(page.getByText("$84",{exact:true}).first()).toBeVisible();
  await page.getByRole("button",{name:"Decrease Dew Point Hydrating Serum quantity"}).click();
  await expect(page.getByText("$42",{exact:true}).first()).toBeVisible();
  await page.getByRole("button",{name:"Complete demo checkout"}).click();
  await expect(page.getByText("This was a concept checkout. No order or payment was placed.")).toBeVisible();
});

test("bag remains usable when browser storage is unavailable",async({page})=>{
  await page.addInitScript(()=>Object.defineProperty(window,"localStorage",{get(){throw new Error("storage unavailable")}}));
  await page.goto("/products/soft-reset-gel-cleanser");
  await page.getByRole("button",{name:/Add to bag —/}).click();
  await expect(page.getByRole("link",{name:/Bag, 1 items/})).toBeVisible();
  await page.getByRole("link",{name:/Bag, 1 items/}).click();
  await expect(page.getByRole("heading",{name:"Soft Reset Gel Cleanser"})).toBeVisible();
});

test("routine can be edited, restarted, and added to bag",async({page})=>{
  await page.goto("/routine");
  await page.getByText("Dry or tight").click();
  await page.getByRole("button",{name:"Continue"}).click();
  await page.getByText("A little more time").click();
  await page.getByRole("button",{name:"Continue"}).click();
  await page.getByText("Even-looking tone").click();
  await page.getByRole("button",{name:"See your routine"}).click();
  await expect(page.getByRole("heading",{name:"Even Light Serum"}).first()).toBeVisible();
  await expect(page.getByRole("heading",{name:"Overnight Comfort Mask"}).first()).toBeVisible();
  await page.getByRole("button",{name:"Add routine to bag"}).click();
  await expect(page.getByRole("link",{name:/Bag, 4 items/})).toBeVisible();
  await page.getByRole("button",{name:"Edit answers"}).click();
  await expect(page.getByRole("heading",{name:"How does your skin usually feel?"})).toBeVisible();
  await page.getByRole("button",{name:"Continue"}).click();
  await page.getByRole("button",{name:"Continue"}).click();
  await page.getByRole("button",{name:"See your routine"}).click();
  await page.getByRole("button",{name:"Start again"}).click();
  await expect(page.getByRole("button",{name:"Continue"})).toBeDisabled();
});

test("navigation, unknown product and reduced motion",async({page})=>{
  await page.goto("/products/not-a-product");
  await expect(page.getByRole("heading",{name:"We couldn’t find that product."})).toBeVisible();
  await page.getByRole("link",{name:"Return to the shop"}).click();
  await expect(page.getByRole("heading",{name:/Care for every day/})).toBeVisible();
  await page.emulateMedia({reducedMotion:"reduce"});
  await expect(page.locator("html")).toHaveCSS("scroll-behavior","auto");
});

test("all six product galleries show their isolated second view",async({page})=>{
  for(const product of products){
    await page.goto(`/products/${product.slug}`);
    await page.getByRole("button",{name:"Show image 2"}).click();
    const image=page.getByRole("img",{name:product.images[1].alt});
    await expect(image).toBeVisible();
    await expect.poll(()=>image.evaluate(element=>(element as HTMLImageElement).complete && (element as HTMLImageElement).naturalWidth>0)).toBe(true);
  }
});

test("all primary routes and newsletter demonstration",async({page})=>{
  await page.goto("/");
  for(const [label,path] of [["Shop","/shop"],["Your routine","/routine"],["Ingredients","/ingredients"],["Philosophy","/philosophy"],["About","/about"]]){
    await page.getByRole("navigation",{name:"Primary navigation"}).getByRole("link",{name:label}).click();
    await expect(page).toHaveURL(new RegExp(`${path}$`));
  }
  await page.goto("/");
  await page.getByLabel("Email address").fill("bad-address");
  await page.getByRole("button",{name:"Preview newsletter signup"}).click();
  await expect(page.getByText("Enter a valid email address.")).toBeVisible();
  await page.getByLabel("Email address").fill("hello@example.com");
  await page.getByRole("button",{name:"Preview newsletter signup"}).click();
  await expect(page.getByText("Demo only: no email was saved or subscribed.")).toBeVisible();
});

for(const width of [360,375,390,430,768,1024,1440]){
  test(`no horizontal overflow at ${width}px`,async({page})=>{
    await page.setViewportSize({width,height:850});
    for(const route of ["/","/shop","/products/soft-reset-gel-cleanser","/routine","/ingredients","/philosophy","/about","/cart"]){
      await page.goto(route);
      const dimensions=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,viewport:document.documentElement.clientWidth}));
      expect(dimensions.scroll,`${route} at ${width}px`).toBeLessThanOrEqual(dimensions.viewport+1);
      await expect(page.getByRole("link",{name:/Bag, \d+ items/})).toBeVisible();
    }
  });
}

test("mobile menu keyboard and accessibility",async({page})=>{
  await page.setViewportSize({width:390,height:844});await page.goto("/");
  await page.getByRole("button",{name:"Open menu"}).click();
  await expect(page.getByRole("navigation",{name:"Mobile navigation"}).getByRole("link",{name:"Shop"})).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button",{name:"Open menu"})).toBeFocused();
  for(const route of ["/","/shop","/products/soft-reset-gel-cleanser","/routine","/ingredients","/philosophy","/about","/cart"]){
    await page.goto(route);const results=await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21a","wcag21aa"]).analyze();expect(results.violations,`${route}: ${JSON.stringify(results.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})))}`).toEqual([]);
  }
});

test("capture portfolio screenshots",async({page})=>{
  await page.setViewportSize({width:1440,height:900});
  await page.goto("/");await page.screenshot({path:"artifacts/screenshots/hero-desktop-1440.png",fullPage:false});
  await page.goto("/shop");await page.screenshot({path:"artifacts/screenshots/products-desktop-1440.png",fullPage:true});
  await page.goto("/products/soft-reset-gel-cleanser");await page.screenshot({path:"artifacts/screenshots/product-detail-desktop-1440.png",fullPage:true});
  await page.getByRole("button",{name:"Show image 2"}).click();
  const cutout=page.getByRole("img",{name:"Isolated SOVA cleanser pump bottle"});
  await expect.poll(()=>cutout.evaluate(element=>(element as HTMLImageElement).complete && (element as HTMLImageElement).naturalWidth>0)).toBe(true);
  await page.evaluate(()=>{document.documentElement.style.scrollBehavior="auto";window.scrollTo(0,0)});
  await page.screenshot({path:"artifacts/screenshots/product-cutout-desktop-1440.png",fullPage:false});
  await page.goto("/routine");await page.getByText("Balanced",{exact:true}).click();await page.getByRole("button",{name:"Continue"}).click();await page.getByText("A little more time").click();await page.getByRole("button",{name:"Continue"}).click();await page.getByText("Hydrated feel").click();await page.getByRole("button",{name:"See your routine"}).click();await page.evaluate(() => {(document.activeElement as HTMLElement | null)?.blur();document.documentElement.style.scrollBehavior="auto";window.scrollTo(0,0)});await page.screenshot({path:"artifacts/screenshots/routine-desktop-1440.png",fullPage:true});
  await page.setViewportSize({width:390,height:844});await page.goto("/shop");await page.screenshot({path:"artifacts/screenshots/mobile-shop-390.png",fullPage:true});
  await page.goto("/products/soft-reset-gel-cleanser");await page.screenshot({path:"artifacts/screenshots/mobile-product-detail-390.png",fullPage:false});
  await page.goto("/routine");await page.screenshot({path:"artifacts/screenshots/mobile-routine-390.png",fullPage:false});
});
