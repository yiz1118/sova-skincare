import { test, expect } from "@playwright/test";
import { products } from "../../data/catalog";

test("UI icons use accessible monochrome SVGs across every page and product", async ({ page }) => {
  const routes = ["/", "/shop", "/routine", "/ingredients", "/philosophy", "/about", "/cart", ...products.map(product => `/products/${product.slug}`)];
  for (const route of routes) {
    await page.goto(route);
    await expect(page.locator("body")).not.toContainText(/[\u2197\u2192\u27A1\u2190\u2B05\u2193\u2B07\u2191\u2212\u00D7\u2715\u2716\u2630\u2637\u22EF\u2713\u2714\u2605\u2665\u2661\u2304\u2303\uFE0F\uFE0E]/u);
    const failures = await page.locator("svg").evaluateAll(icons => icons.filter(icon => icon.getAttribute("aria-hidden") !== "true" || icon.getAttribute("focusable") !== "false" || icon.getAttribute("stroke") !== "currentColor" || icon.getAttribute("fill") !== "none").map(icon => icon.outerHTML));
    expect(failures, route).toEqual([]);
    if (route.startsWith("/products/")) await expect(page.locator(".product-benefits>div svg")).toHaveCount(products.find(product => route.endsWith(product.slug))!.benefits.length);
  }
});

test("mobile menu retains a labelled 44px target and SVG open/close icons", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  const menu = page.getByRole("button", { name: "Open menu", exact: true });
  const box = await menu.boundingBox();
  expect(box!.width).toBeGreaterThanOrEqual(44);
  expect(box!.height).toBeGreaterThanOrEqual(44);
  await expect(menu.locator("svg")).toHaveAttribute("aria-hidden", "true");
  await menu.click();
  await expect(page.getByRole("button", { name: "Close menu", exact: true }).locator("svg")).toHaveAttribute("focusable", "false");
  await page.keyboard.press("Escape");
  await expect(menu).toBeFocused();
});
