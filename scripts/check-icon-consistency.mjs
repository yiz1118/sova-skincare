import { chromium, devices, webkit } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const phase = process.argv[2] ?? "after";
const engine = process.argv[3] ?? "chrome";
const baseURL = process.env.SOVA_QA_URL ?? "http://127.0.0.1:3115";
const root = "artifacts/icon-consistency";
const directory = path.join(root, phase, engine);
const widths = [375, 390, 430, 768, 1024, 1440];
const routes = ["/", "/shop", "/products/soft-reset-gel-cleanser", "/routine", "/ingredients", "/philosophy", "/about", "/cart"];
const unsafeIcons = /[\u2197\u2192\u27A1\u2190\u2B05\u2193\u2B07\u2191\u2212\u00D7\u2715\u2716\u2630\u2637\u22EF\u2713\u2714\u2605\u2665\u2661\u2304\u2303\uFE0F\uFE0E]/u;
const browser = engine === "webkit" ? await webkit.launch() : await chromium.launch({ channel: engine === "edge" ? "msedge" : "chrome" });
const context = await browser.newContext({ ...(engine === "android" ? devices["Pixel 7"] : {}), viewport: { width: 1440, height: 900 }, reducedMotion: "reduce", hasTouch: true });
const page = await context.newPage();
const report = { phase, engine, measurements: [], iconFailures: [], overflow: [], screenshots: [], interactions: [] };
await fs.mkdir(directory, { recursive: true });

async function settle() {
  await page.evaluate(async () => {
    await document.fonts.ready;
    const images = Array.from(document.images);
    images.forEach(image => { image.loading = "eager"; });
    await Promise.all(images.map(image => image.decode().catch(() => {})));
    document.activeElement?.blur();
    window.scrollTo(0, 0);
  });
}

async function inspect(key, width) {
  const result = await page.evaluate(() => {
    const visible = element => element.getBoundingClientRect().width > 0 && element.getBoundingClientRect().height > 0 && getComputedStyle(element).visibility !== "hidden";
    const rect = element => {
      const box = element.getBoundingClientRect();
      return [box.x, box.y, box.width, box.height].map(value => Math.round(value * 100) / 100);
    };
    const elements = Array.from(document.querySelectorAll("header,.header-inner,main,section,h1,h2,h3,.product-benefits>div,.step-number,button,.button,.product-card,.product-detail-grid,.product-accordions,.routine-steps li,.site-footer"));
    const icons = Array.from(document.querySelectorAll("svg"));
    return {
      viewport: document.documentElement.clientWidth,
      scroll: document.documentElement.scrollWidth,
      geometry: elements.filter(visible).map(element => ({ tag: element.tagName, class: element.className, rect: rect(element) })),
      icons: icons.map(icon => ({ hidden: icon.getAttribute("aria-hidden"), focusable: icon.getAttribute("focusable"), stroke: icon.getAttribute("stroke"), fill: icon.getAttribute("fill"), rect: rect(icon), color: getComputedStyle(icon).color, background: getComputedStyle(icon).backgroundColor })),
      text: document.body.innerText,
      masks: [...icons, ...document.querySelectorAll(".product-benefits>div>span")].filter(visible).map(rect).concat(Array.from(document.querySelectorAll(".step-number")).filter(visible).map(element => {
        const [left, top, width, height] = rect(element);
        // Full-page capture can vertically offset the selected routine step
        // while keeping the measured layout unchanged. Confine the allowed
        // optical change to the number column.
        return [left - 4, top - 75, width + 8, height + 150];
      })),
      imageRegions: Array.from(document.images).filter(visible).map(rect),
    };
  });
  if (result.scroll > result.viewport + 1) report.overflow.push({ key, width, scroll: result.scroll });
  if (unsafeIcons.test(result.text)) report.iconFailures.push({ key, width, reason: "Unicode UI icon or variation selector rendered as text" });
  for (const icon of result.icons) {
    if (icon.hidden !== "true" || icon.focusable !== "false" || icon.stroke !== "currentColor" || icon.fill !== "none" || icon.background !== "rgba(0, 0, 0, 0)") {
      report.iconFailures.push({ key, width, reason: "SVG does not follow decorative monochrome standard", icon });
    }
  }
  report.measurements.push({ key, width, geometry: result.geometry });
  return { masks: result.masks, imageRegions: result.imageRegions };
}

async function screenshot(key, { masks, imageRegions }) {
  const filename = `${key}.png`;
  await page.screenshot({ path: path.join(directory, filename), fullPage: true });
  report.screenshots.push({ filename, masks, imageRegions });
}

try {
  for (const width of widths) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of routes) {
      await page.goto(`${baseURL}${route}`);
      await settle();
      const key = route === "/" ? "home" : route.split("/").at(-1);
      const masks = await inspect(key, width);
      if ([390, 1440].includes(width) && ["home", "shop", "soft-reset-gel-cleanser", "routine"].includes(key)) await screenshot(`${key}-${width}`, masks);
    }
  }
  const catalog = await fs.readFile("data/catalog.ts", "utf8");
  const productSlugs = [...catalog.matchAll(/slug:\s*"([^"]+)"/g)].map(match => match[1]);
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const slug of productSlugs) {
      await page.goto(`${baseURL}/products/${slug}`);
      await settle();
      await inspect(`catalog-${slug}`, width);
    }
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${baseURL}/routine`);
  await page.getByText("Dry or tight", { exact: true }).click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByText("A little more time", { exact: true }).click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByText("Even-looking tone", { exact: true }).click();
  await page.getByRole("button", { name: "See your routine", exact: true }).click();
  await settle();
  await screenshot("routine-optional-1440", await inspect("routine-optional", 1440));
  report.interactions.push("Routine selection and optional step");
  await page.getByRole("button", { name: "Add routine to bag", exact: true }).click();
  await page.goto(`${baseURL}/cart`);
  await settle();
  await screenshot("cart-filled-1440", await inspect("cart-filled", 1440));
  report.interactions.push("Add routine to bag");
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto(`${baseURL}/`);
  const menu = page.getByRole("button", { name: "Open menu", exact: true });
  const menuBox = await menu.boundingBox();
  if (phase === "after" && (!menuBox || menuBox.width < 44 || menuBox.height < 44)) throw new Error("Menu touch target is below 44px");
  await menu.tap();
  await page.getByRole("navigation", { name: "Mobile navigation" }).getByRole("link", { name: "Shop", exact: true }).waitFor({ state: "visible" });
  await settle();
  await screenshot("menu-open-390", await inspect("menu-open", 390));
  await page.getByRole("button", { name: "Close menu", exact: true }).tap();
  report.interactions.push("Mobile menu touch open and close");
  await page.setViewportSize({ width: engine === "android" ? 390 : 1440, height: 900 });
  await page.goto(`${baseURL}/shop`);
  if (engine === "android") {
    await page.locator(".product-card-media").first().tap();
    await page.waitForURL(/\/products\//);
    report.interactions.push("Android-emulated product-card touch");
  } else {
    await page.locator(".product-card-media").first().hover();
    await page.waitForFunction(() => getComputedStyle(document.querySelector(".card-arrow")).opacity === "1");
    report.interactions.push("Desktop product-card hover");
  }
  await page.goto(`${baseURL}/products/soft-reset-gel-cleanser`);
  await page.getByRole("button", { name: "Next product image", exact: true }).click();
  await page.getByRole("button", { name: "Previous product image", exact: true }).click();
  await page.getByText("How to use", { exact: true }).click();
  if (!await page.locator("details").filter({ hasText: "How to use" }).evaluate(element => element.open)) throw new Error("Accordion failed");
  report.interactions.push("Gallery next/previous and accordion");
  if (await page.locator("html").evaluate(element => getComputedStyle(element).scrollBehavior) !== "auto") throw new Error("Reduced motion failed");
  report.interactions.push("Reduced motion");

  if (phase === "after" && engine === "chrome") {
    const baseline = JSON.parse(await fs.readFile(path.join(root, "before", engine, "report.json"), "utf8"));
    report.geometryChanges = report.measurements.flatMap((current, index) => current.geometry.flatMap((item, elementIndex) => {
      const previous = baseline.measurements[index]?.geometry[elementIndex];
      // The menu gains a 44px hit box; negative margins preserve its SVG center
      // and its contribution to the unchanged header grid.
      if (item.class === "menu-toggle" && previous && item.rect[2] === 44 && item.rect[3] === 44 && Math.abs(item.rect[0] + item.rect[2] / 2 - previous.rect[0] - previous.rect[2] / 2) < .5 && Math.abs(item.rect[1] + item.rect[3] / 2 - previous.rect[1] - previous.rect[3] / 2) < .5) return [];
      if (!previous || item.tag !== previous.tag || item.class !== previous.class || item.rect.some((value, position) => Math.abs(value - previous.rect[position]) > .5)) return [{ key: current.key, width: current.width, previous, current: item }];
      return [];
    }));
    report.pixelComparisons = [];
    for (const shot of report.screenshots) {
      const before = await sharp(path.join(root, "before", engine, shot.filename)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
      const after = await sharp(path.join(directory, shot.filename)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
      const footer = report.measurements.find(item => shot.filename.startsWith(`${item.key}-${item.width}`))?.geometry.find(item => item.tag === "FOOTER");
      const visibleBottom = footer ? footer.rect[1] + footer.rect[3] : 0;
      if (before.info.width !== after.info.width || Math.min(before.info.height, after.info.height) < visibleBottom - 1) { report.pixelComparisons.push({ filename: shot.filename, sizeChanged: true }); continue; }
      const masks = [...shot.masks, ...(baseline.screenshots.find(item => item.filename === shot.filename)?.masks ?? [])];
      let changedOutsideIcons = 0;
      let changedOutsideIconsAndImages = 0;
      let changedImagePixels = 0;
      let imageMaxChannelDelta = 0;
      for (let y = 0; y < Math.min(before.info.height, after.info.height); y++) for (let x = 0; x < before.info.width; x++) {
        const offset = (y * before.info.width + x) * 4;
        if (before.data[offset] === after.data[offset] && before.data[offset + 1] === after.data[offset + 1] && before.data[offset + 2] === after.data[offset + 2]) continue;
        if (masks.some(([left, top, width, height]) => x >= left - 2 && x <= left + width + 2 && y >= top - 2 && y <= top + height + 2)) continue;
        changedOutsideIcons++;
        const delta = Math.max(Math.abs(before.data[offset] - after.data[offset]), Math.abs(before.data[offset + 1] - after.data[offset + 1]), Math.abs(before.data[offset + 2] - after.data[offset + 2]));
        if (shot.imageRegions.some(([left, top, width, height]) => x >= left - 2 && x <= left + width + 2 && y >= top - 2 && y <= top + height + 2)) {
          changedImagePixels++;
          imageMaxChannelDelta = Math.max(imageMaxChannelDelta, delta);
        } else if (delta > 4) changedOutsideIconsAndImages++;
      }
      report.pixelComparisons.push({ filename: shot.filename, canvasHeightBefore: before.info.height, canvasHeightAfter: after.info.height, changedOutsideIcons, changedOutsideIconsAndImages, changedImagePixels, imageMaxChannelDelta });
    }
  }
  await fs.writeFile(path.join(directory, "report.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ phase, engine, pageChecks: report.measurements.length, overflow: report.overflow.length, iconFailures: report.iconFailures.length, geometryChanges: report.geometryChanges?.length, pixelComparisons: report.pixelComparisons, interactions: report.interactions }, null, 2));
  // Rebuilt optimized images can differ slightly in decoding/resampling. Keep
  // those raw counts in the report and reject meaningful non-icon differences.
  if (phase === "after" && (report.iconFailures.length || report.overflow.length || report.geometryChanges?.length || report.pixelComparisons?.some(item => item.sizeChanged || item.changedOutsideIconsAndImages > 0))) process.exitCode = 1;
} finally { await browser.close(); }
