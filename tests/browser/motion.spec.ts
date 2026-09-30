import { test, expect } from "@playwright/test";

const routes = ["/", "/shop", "/products/soft-reset-gel-cleanser", "/routine", "/ingredients", "/philosophy", "/about", "/cart"];

test("scroll reveals are readable, settle, and play once", async ({ page }) => {
  await page.goto("/");
  const image = page.locator('.editorial-image [data-reveal]');
  await expect(image).not.toHaveAttribute("data-reveal-state", "entered");
  await expect(image).toHaveCSS("opacity", "1");
  await image.scrollIntoViewIfNeeded();
  await expect(image).toHaveAttribute("data-reveal-state", "entered");
  await expect.poll(() => image.evaluate(element => element.getAnimations().filter(animation => animation.playState === "running").length)).toBe(0);
  await expect(image).toHaveAttribute("data-reveal-state", "settled");
  await expect(image).toHaveCSS("opacity", "1");
  await page.locator("h1").scrollIntoViewIfNeeded();
  await image.scrollIntoViewIfNeeded();
  expect(await image.evaluate(element => element.getAnimations().filter(animation => animation.playState === "running").length)).toBe(0);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(image).toHaveCSS("animation-name", "none");
  const card = page.locator(".product-card").first();
  await card.locator("a").first().focus();
  await expect(card).toHaveCSS("opacity", "1");
  await expect(card.locator("a").first()).toBeFocused();
});

test("content is visible with JavaScript or IntersectionObserver unavailable", async ({ browser, page }) => {
  await page.addInitScript(() => Reflect.deleteProperty(window, "IntersectionObserver"));
  await page.goto("/");
  await expect(page.locator(".editorial-copy")).toHaveCSS("opacity", "1");
  await expect(page.locator(".product-card").first()).toHaveCSS("opacity", "1");
  const context = await browser.newContext({ javaScriptEnabled: false });
  const staticPage = await context.newPage();
  await staticPage.goto("http://127.0.0.1:3115/ingredients");
  await expect(staticPage.getByRole("heading", { name: "Glycerin", exact: true })).toBeVisible();
  await expect(staticPage.locator(".ingredient-card").last()).toHaveCSS("opacity", "1");
  await context.close();
});

test("reduced motion removes entrances, reveals, and movement after preference changes", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const route of routes) {
    await page.goto(route);
    await expect(page.locator("h1")).toHaveCSS("animation-name", "none");
    await expect(page.locator("html")).toHaveCSS("scroll-behavior", "auto");
    const reveal = page.locator("[data-reveal]").first();
    if (await reveal.count()) {
      await reveal.scrollIntoViewIfNeeded();
      await expect(reveal).toHaveCSS("opacity", "1");
      await expect(reveal).toHaveCSS("animation-name", "none");
    }
  }
  await page.goto("/");
  const button = page.getByRole("link", { name: "Explore the collection", exact: true });
  await button.hover();
  await expect(button).toHaveCSS("transform", "none");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.locator(".editorial-image img").scrollIntoViewIfNeeded();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".editorial-image img")).toHaveCSS("opacity", "1");
  await expect(page.locator(".editorial-image img")).toHaveCSS("transform", "none");
});

test("gallery crossfades keep one accessible image and preserve its frame", async ({ page }) => {
  await page.goto("/products/soft-reset-gel-cleanser");
  const frame = page.locator(".product-main-image");
  const before = await frame.boundingBox();
  await page.getByRole("button", { name: "Show image 2" }).click();
  await expect(page.locator(".gallery-image:not([aria-hidden=true])")).toHaveCount(1);
  await expect(page.getByRole("img", { name: "Isolated SOVA cleanser pump bottle" })).toBeVisible();
  await expect(page.locator(".gallery-image.is-active")).toHaveCSS("opacity", "1");
  const after = await frame.boundingBox();
  expect(after!.width).toBeCloseTo(before!.width, 1);
  expect(after!.height).toBeCloseTo(before!.height, 1);
  await page.getByRole("button", { name: "Previous product image" }).click();
  await expect(page.getByRole("button", { name: "Show image 1" })).toHaveAttribute("aria-pressed", "true");
});

test("routine transitions focus the new question and remain immediately usable", async ({ page }) => {
  await page.goto("/routine");
  await page.getByText("Balanced", { exact: true }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByRole("heading", { name: "What kind of routine fits your day?" })).toBeFocused();
  await page.getByText("Just the essentials").click();
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByRole("heading", { name: "What would you like to focus on?" })).toBeFocused();
  await page.getByText("Hydrated feel").click();
  await page.getByRole("button", { name: "See your routine" }).click();
  await expect(page.getByRole("heading", { name: "A little rhythm, made for you." })).toBeFocused();
  await page.getByRole("button", { name: "Edit answers" }).click();
  await expect(page.getByRole("heading", { name: "How does your skin usually feel?" })).toBeFocused();
});

test("mobile navigation responds to keyboard and touch without waiting for animation", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  const shop = page.getByRole("navigation", { name: "Mobile navigation" }).getByRole("link", { name: "Shop", exact: true });
  await expect(shop).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Open menu" })).toBeFocused();
  await page.getByRole("button", { name: "Open menu" }).click();
  await shop.click();
  await expect(page).toHaveURL(/\/shop$/);
  await expect(page.getByRole("button", { name: "Open menu" })).toHaveAttribute("aria-expanded", "false");
});

test("all pages scroll without errors, overflow, or animation-driven layout shifts", async ({ page }, testInfo) => {
  test.setTimeout(90000);
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  const results: { route: string; shifts: number | null; overflow: boolean }[] = [];
  for (const route of routes) {
    await page.goto(route);
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all(Array.from(document.images).filter(image => image.complete || image.loading !== "lazy").map(image => image.decode().catch(() => {})));
      await Promise.all(document.getAnimations().map(animation => animation.finished.catch(() => {})));
    });
    await page.evaluate(() => {
      const state = window as typeof window & { motionShifts?: number };
      state.motionShifts = undefined;
      if (!PerformanceObserver.supportedEntryTypes.includes("layout-shift")) return;
      state.motionShifts = 0;
      new PerformanceObserver(list => {
        for (const entry of list.getEntries()) state.motionShifts! += (entry as PerformanceEntry & { value: number }).value;
      }).observe({ type: "layout-shift" });
    });
    const reveals = page.locator("[data-reveal]");
    for (let index = 0; index < await reveals.count(); index++) {
      await reveals.nth(index).scrollIntoViewIfNeeded();
    }
    await page.locator(".site-footer").scrollIntoViewIfNeeded();
    await page.evaluate(async () => {
      await Promise.all(document.getAnimations().map(animation => animation.finished.catch(() => {})));
    });
    const result = await page.evaluate(() => ({
      shifts: (window as typeof window & { motionShifts?: number }).motionShifts ?? null,
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    }));
    expect(result.overflow, route).toBe(false);
    if (result.shifts !== null) expect(result.shifts, `${route}: post-load motion layout shifts`).toBe(0);
    results.push({ route, ...result });
  }
  expect(errors).toEqual([]);
  await testInfo.attach("motion-runtime-checks", { body: JSON.stringify({ browser: testInfo.project.name || "chrome", errors, results }, null, 2), contentType: "application/json" });
});

test("capture settled desktop and mobile motion surfaces", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "", "Screenshots use the main Chrome suite.");
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.screenshot({ path: "artifacts/motion/home-desktop-1440.png", animations: "disabled" });
  await page.locator(".editorial-panel").scrollIntoViewIfNeeded();
  await page.screenshot({ path: "artifacts/motion/editorial-desktop-1440.png", animations: "disabled" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/ingredients");
  await page.locator(".ingredient-card").first().scrollIntoViewIfNeeded();
  await page.screenshot({ path: "artifacts/motion/ingredients-mobile-390.png", animations: "disabled" });
  await page.goto("/routine");
  await page.getByText("Balanced", { exact: true }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.screenshot({ path: "artifacts/motion/routine-mobile-390.png", animations: "disabled" });
});
