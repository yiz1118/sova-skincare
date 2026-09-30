"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** One-time, progressive reveals. Content stays visible before JS and observation. */
export function ScrollReveals() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window.IntersectionObserver !== "function") return;

    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const registered = new WeakSet<HTMLElement>();
    const played = new WeakSet<HTMLElement>();
    const active = new Set<HTMLElement>();

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const element = entry.target as HTMLElement;
        observer.unobserve(element);
        played.add(element);
        // Never animate a control that the visitor has already focused.
        if (preference.matches || element.contains(document.activeElement)) continue;
        active.add(element);
        element.dataset.revealState = "entered";
      }
    }, { threshold: 0.08 });

    function register(root: ParentNode) {
      const elements = root.querySelectorAll<HTMLElement>("[data-reveal]");
      for (const element of elements) {
        if (registered.has(element)) continue;
        registered.add(element);
        if (!preference.matches && !played.has(element)) observer.observe(element);
      }
      if (root instanceof HTMLElement && root.matches("[data-reveal]") && !registered.has(root)) {
        registered.add(root);
        if (!preference.matches) observer.observe(root);
      }
    }

    function cancel(element: HTMLElement) {
      element.getAnimations().forEach((animation) => animation.cancel());
      element.dataset.revealState = "settled";
      active.delete(element);
    }

    function focus(event: FocusEvent) {
      if (!(event.target instanceof HTMLElement)) return;
      for (const element of active) {
        if (element.contains(event.target)) cancel(element);
      }
    }

    function finished(event: AnimationEvent) {
      if (event.target instanceof HTMLElement && active.has(event.target)) {
        event.target.dataset.revealState = "settled";
        active.delete(event.target);
      }
    }

    function changePreference() {
      observer.disconnect();
      if (preference.matches) {
        active.forEach(cancel);
      } else {
        document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((element) => {
          if (!played.has(element)) observer.observe(element);
        });
      }
    }

    register(document);
    // Shop filters and routine results add content without changing the route.
    const mutations = new MutationObserver((records) => {
      for (const record of records) {
        record.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) register(node);
        });
        record.removedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          observer.unobserve(node);
          node.querySelectorAll<HTMLElement>("[data-reveal]").forEach((element) => observer.unobserve(element));
          for (const element of active) {
            if (element === node || node.contains(element)) cancel(element);
          }
        });
      }
    });
    mutations.observe(document.body, { childList: true, subtree: true });
    document.addEventListener("focusin", focus);
    document.addEventListener("animationend", finished);
    preference.addEventListener("change", changePreference);

    return () => {
      observer.disconnect();
      mutations.disconnect();
      active.forEach(cancel);
      document.removeEventListener("focusin", focus);
      document.removeEventListener("animationend", finished);
      preference.removeEventListener("change", changePreference);
    };
  }, [pathname]);

  return null;
}
