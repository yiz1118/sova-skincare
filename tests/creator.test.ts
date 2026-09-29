import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { creator, creatorContactLinks, conceptProject } from "../config/creator";
import { CreatorCredit } from "../components/creator-credit";

test("contact URLs carry encoded project context and use the creator configuration", () => {
  const links = creatorContactLinks();
  const whatsapp = new URL(links.whatsapp);
  assert.equal(whatsapp.origin + whatsapp.pathname, creator.whatsappUrl);
  assert.ok(whatsapp.searchParams.get("text")?.includes(`${conceptProject.name} concept project`));
  assert.ok(whatsapp.searchParams.get("text")?.startsWith(`Hi ${creator.name.split(" ")[0]},`));
  const email = new URL(links.email);
  assert.equal(email.pathname, creator.email);
  assert.equal(email.searchParams.get("subject"), `Project Inquiry — ${conceptProject.name}`);
  assert.ok(email.searchParams.get("body")?.includes(`your ${conceptProject.name} concept project`));
  const custom = creatorContactLinks({ ...creator, name: "Example Creator", email: "hello@example.com" }, "A & B / New project");
  assert.equal(new URL(custom.whatsapp).searchParams.get("text")?.includes("A & B / New project"), true);
  assert.equal(new URL(custom.email).pathname, "hello@example.com");
});

test("portfolio CTA appears only after a portfolio URL is configured", () => {
  const previous = creator.portfolioUrl;
  try {
    creator.portfolioUrl = null;
    assert.doesNotMatch(renderToStaticMarkup(createElement(CreatorCredit)), /View Portfolio|creator_portfolio/);
    creator.portfolioUrl = "https://example.com/portfolio";
    const markup = renderToStaticMarkup(createElement(CreatorCredit));
    assert.match(markup, /View Portfolio/);
    assert.match(markup, /href="https:\/\/example.com\/portfolio"/);
    assert.match(markup, /data-analytics-event="creator_portfolio"/);
  } finally {
    creator.portfolioUrl = previous;
  }
});
