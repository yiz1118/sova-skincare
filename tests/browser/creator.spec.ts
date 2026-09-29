import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { creator, creatorContactLinks, conceptProject } from "../../config/creator";

test("creator credit is present on every page without a placeholder portfolio link", async ({ page }) => {
  for (const route of ["/", "/shop", "/products/soft-reset-gel-cleanser", "/routine", "/ingredients", "/philosophy", "/about", "/cart"]) {
    await page.goto(route);
    const section = page.locator(".creator-layer");
    await expect(section.getByRole("heading", { name: creator.name, exact: true })).toBeVisible();
    await expect(section.getByText(conceptProject.status, { exact: true })).toBeVisible();
    await expect(section.getByText(creator.title, { exact: true })).toBeVisible();
    await expect(section.getByText(creator.location, { exact: true })).toBeVisible();
    await expect(section.getByText(creator.availability, { exact: true })).toBeVisible();
    await expect(section.getByRole("link", { name: /View Portfolio/ })).toHaveCount(0);
    expect(await section.locator('a[href="#"],a[href=""],a[href^="javascript:"]').count()).toBe(0);
  }
});

for (const width of [375, 390, 430, 768, 1024, 1440]) {
  test(`creator contact disclosure, links, focus and layout at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const section = page.locator(".creator-layer");
    const start = section.locator("summary");
    await start.focus();
    await expect(start).toBeFocused();
    await page.keyboard.press("Enter");
    const choices = section.locator(".creator-contact-options");
    await expect(choices).toBeVisible();
    await page.keyboard.press("Tab");
    await expect(choices.getByRole("link", { name: /WhatsApp/ })).toBeFocused();
    const contacts = creatorContactLinks();
    for (const [event, href] of [["creator_whatsapp", contacts.whatsapp], ["creator_email", contacts.email], ["creator_linkedin", creator.linkedinUrl], ["creator_github", creator.githubUrl]]) {
      const link = section.locator(`[data-analytics-event="${event}"]`);
      await expect(link).toHaveAttribute("href", href);
      const box = await link.boundingBox();
      expect(box!.height).toBeGreaterThanOrEqual(44);
      if (event !== "creator_email") {
        await expect(link).toHaveAttribute("target", "_blank");
        await expect(link).toHaveAttribute("rel", "noopener noreferrer");
      }
    }
    await expect(start).toHaveAttribute("data-analytics-event", "creator_start_project");
    const dimensions = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth }));
    expect(dimensions.scroll).toBeLessThanOrEqual(dimensions.viewport + 1);
    const results = await new AxeBuilder({ page }).include(".site-footer").withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    expect(results.violations).toEqual([]);
    if ([390, 1440].includes(width)) {
      // Capture the footer in a matching viewport. Element clips taller than
      // the viewport can incorrectly include the offscreen fixed skip link.
      async function captureFooter(path: string) {
        const height = await page.locator(".site-footer").evaluate(element => Math.ceil(element.getBoundingClientRect().height));
        await page.setViewportSize({ width, height });
        await page.evaluate(() => {
          (document.activeElement as HTMLElement | null)?.blur();
          document.documentElement.style.scrollBehavior = "auto";
          window.scrollTo(0, document.documentElement.scrollHeight);
        });
        await page.screenshot({ path });
        await page.setViewportSize({ width, height: 900 });
      }
      await captureFooter(`artifacts/screenshots/creator-footer-open-${width}.png`);
      await start.click();
      await expect(choices).not.toBeVisible();
      await captureFooter(`artifacts/screenshots/creator-footer-${width}.png`);
    }
  });
}
