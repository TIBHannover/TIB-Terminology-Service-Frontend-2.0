import { expect, type Locator, type Page } from "@playwright/test";

export const BASE_URL = "http://localhost:3000";

export async function disableTourAndCookieBanner(page: Page) {
  await page.addInitScript(() => {
    window.localStorage.setItem(
      "tour_profile",
      JSON.stringify({
        homepage: true,
        ontoPageTabs: true,
        ontoOverViewPage: true,
        ontoClassTreePage: true,
        ontoPropertyTreePage: true,
        ontoIndividualPage: true,
        ontoClassListPage: true,
        ontoNotesPage: true,
        ontoGithubPage: true,
        ontoListPage: true,
      }),
    );
    window.localStorage.setItem("cookie-show", "false");
  });
}

export async function gotoPath(page: Page, path = "") {
  await disableTourAndCookieBanner(page);
  await page.goto(BASE_URL + process.env.REACT_APP_PROJECT_SUB_PATH + path);
}

export async function expectImageLoaded(image: Locator) {
  await expect
    .poll(
      () =>
        image.evaluate(
          (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
        ),
      { timeout: 15000 },
    )
    .toBe(true);
}

export async function visibleCards(page: Page, selector = "div.result-card") {
  const cards = page.locator(selector);
  await expect(cards.first()).toBeVisible();
  return cards;
}

export async function locatorTexts(locator: Locator, selector: string) {
  return (await locator.locator(selector).allInnerTexts()).map((text) =>
    text.trim(),
  );
}

export function numbersFromText(texts: string[]) {
  return texts.map((text) => Number(text.replace(/\D/g, "")));
}

export function expectSortedAscending(values: string[]) {
  expect(values).toEqual(
    [...values].sort((a, b) =>
      a.localeCompare(b, "en", { sensitivity: "base" }),
    ),
  );
}

export function expectSortedDescending(values: number[]) {
  expect(values).toEqual([...values].sort((a, b) => b - a));
}

export async function getBackgroundColor(locator: Locator) {
  return locator.evaluate(
    (element) => getComputedStyle(element).backgroundColor,
  );
}
