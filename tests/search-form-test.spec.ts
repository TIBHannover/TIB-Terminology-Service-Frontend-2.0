import { expect, test, type Page } from "@playwright/test";
import { getBackgroundColor, gotoPath } from "./libs";

const SEARCH_QUERY = "assay";

async function gotoHome(page: Page) {
  await gotoPath(page);
  await expect(searchInput(page)).toBeVisible();
}

function searchInput(page: Page) {
  return page.locator("#s-field");
}

function autocompleteItems(page: Page) {
  return page.locator("#autocomplete-container .autocomplete-item");
}

function jumpToRows(page: Page) {
  return page.locator("#jumpresult-container .jumto-result-link");
}

async function typeSearchQuery(page: Page) {
  await searchInput(page).fill(SEARCH_QUERY);
  await expect(page.locator("#autocomplete-container")).toBeVisible();
  await expect(page.locator("#jumpresult-container")).toBeVisible();
}

test("header search form shows autocomplete and jump-to results for assay", async ({
  page,
}) => {
  await gotoHome(page);
  await expect(page.locator(".site-header-searchbox-holder")).toBeVisible();

  await typeSearchQuery(page);

  await expect(autocompleteItems(page)).toHaveCount(5);
  await expect(jumpToRows(page)).toHaveCount(5);
  expect(
    await autocompleteItems(page).filter({ hasText: SEARCH_QUERY }).count(),
  ).toBeGreaterThan(0);

  const assayJumpToRow = jumpToRows(page)
    .filter({ hasText: SEARCH_QUERY })
    .first();
  await expect(assayJumpToRow).toBeVisible();
  await expect(assayJumpToRow.locator(".jumpto-badge-onto")).toHaveCount(2);
});

test("header search form supports keyboard navigation through results", async ({
  page,
}) => {
  await gotoHome(page);
  await typeSearchQuery(page);

  const navigableItems = page.locator(".item-for-navigation");
  await expect(navigableItems).toHaveCount(10);

  await page.keyboard.press("ArrowDown");
  await expect(navigableItems.nth(0)).toHaveClass(/selected-by-arrow-key/);

  await page.keyboard.press("ArrowDown");
  await expect(navigableItems.nth(1)).toHaveClass(/selected-by-arrow-key/);

  await page.keyboard.press("ArrowUp");
  await expect(navigableItems.nth(0)).toHaveClass(/selected-by-arrow-key/);
});

test("header search autocomplete result is clickable and has hover feedback", async ({
  page,
}) => {
  await gotoHome(page);
  await typeSearchQuery(page);

  const autocompleteResult = autocompleteItems(page)
    .filter({ hasText: SEARCH_QUERY })
    .first();
  const initialBackground = await getBackgroundColor(autocompleteResult);

  await autocompleteResult.hover();
  await expect
    .poll(() => getBackgroundColor(autocompleteResult))
    .not.toBe(initialBackground);

  await autocompleteResult.click();
  await expect(page).toHaveURL(/\/search\?/);
  await expect(page).toHaveURL(new RegExp(`[?&]q=${SEARCH_QUERY}`));
});

test("header search jump-to result is clickable and opens an ontology page", async ({
  page,
}) => {
  await gotoHome(page);
  await typeSearchQuery(page);

  await jumpToRows(page).filter({ hasText: SEARCH_QUERY }).first().click();
  await expect(page).toHaveURL(/\/ontologies\/.+\/(terms|props|individuals)\?/);
});

test("header search triggers from button click and keeps the query in the URL and input", async ({
  page,
}) => {
  await gotoHome(page);
  await searchInput(page).fill(SEARCH_QUERY);
  await page.locator(".search-btn").click();

  await expect(page).toHaveURL(/\/search\?/);
  await expect(page).toHaveURL(new RegExp(`[?&]q=${SEARCH_QUERY}`));
  await expect(searchInput(page)).toHaveValue(SEARCH_QUERY);
});

test("header search triggers from enter and keeps the query in the URL and input", async ({
  page,
}) => {
  await gotoHome(page);
  await searchInput(page).pressSequentially(SEARCH_QUERY);
  await searchInput(page).press("Enter");

  await expect(page).toHaveURL(/\/search\?/);
  await expect(page).toHaveURL(new RegExp(`[?&]q=${SEARCH_QUERY}`));
  await expect(searchInput(page)).toHaveValue(SEARCH_QUERY);
});

test("header search checkboxes are present and clickable", async ({ page }) => {
  await gotoHome(page);

  for (const checkboxId of [
    "exact-checkbox",
    "obsoletes-checkbox",
    "include-imported-checkbox",
  ]) {
    const checkbox = page.locator(`#${checkboxId}`);
    await expect(checkbox).toBeVisible();
    const wasChecked = await checkbox.isChecked();
    await checkbox.click();
    await expect(checkbox).toBeChecked({ checked: !wasChecked });
  }
});

test("header search advanced search toggle opens and closes the advanced section", async ({
  page,
}) => {
  await gotoHome(page);

  const advancedToggle = page.locator("#adv-search-toggle");
  const advancedSection = page.locator(".adv-search-container");
  await expect(advancedToggle).toBeVisible();

  if (await advancedToggle.isChecked()) {
    await expect(advancedSection).toBeVisible();
    await advancedToggle.click();
    await expect(advancedSection).toBeHidden();
  } else {
    await expect(advancedSection).toBeHidden();
    await advancedToggle.click();
    await expect(advancedSection).toBeVisible();
    await advancedToggle.click();
    await expect(advancedSection).toBeHidden();
  }
});
