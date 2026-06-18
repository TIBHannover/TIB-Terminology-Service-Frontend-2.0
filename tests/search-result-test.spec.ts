import { expect, test, type Locator, type Page } from "@playwright/test";
import { BASE_URL } from "./libs";

const SEARCH_QUERY = "assay";
const EMPTY_QUERY = "ddddddd";
const OBI_TERM_ID = /OBI[:_]0000070/;

async function gotoSearch(page: Page, params = `q=${SEARCH_QUERY}`) {
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
  await page.goto(`${BASE_URL}/search?${params}`);
  await expect(resultHeading(page)).toBeVisible();
  await expect(page).toHaveURL(/includeimported=true/);
  await expect(page.locator(".is-loading-term-list")).toBeHidden();
}

function resultHeading(page: Page) {
  return page.locator("#search-list-grid h3.text-dark").first();
}

function resultCards(page: Page) {
  return page.locator("#search-list-grid .result-card");
}

function resultCountFromText(text: string) {
  return Number(text.match(/^(\d+) results found/)?.[1] ?? 0);
}

async function resultCount(page: Page) {
  return resultCountFromText(await resultHeading(page).innerText());
}

async function waitForResultCountBelow(page: Page, count: number) {
  await expect
    .poll(() => resultCount(page), { timeout: 15000 })
    .toBeLessThan(count);
}

function facetCheckbox(page: Page, value: string) {
  return page.locator(`#search-checkbox-${value}`);
}

function facetLabel(page: Page, value: string) {
  return page.locator(`label[for="search-checkbox-${value}"]`);
}

async function clickFacetCheckbox(page: Page, value: string) {
  await facetCheckbox(page, value).evaluate((element: HTMLInputElement) =>
    element.click(),
  );
}

async function showVibsoOntologyFacet(page: Page) {
  const filter = page.locator("#filter-onto-list");
  await filter.fill("");
  await filter.click();
  await page.keyboard.type("vibso");
  await expect(facetLabel(page, "VIBSO")).toBeVisible();
  await expect
    .poll(() => page.locator(".ontology-facet-checkbox").count(), {
      timeout: 15000,
    })
    .toBe(1);
}

async function obiAssayCard(page: Page) {
  await page.locator("#list-result-per-page").selectOption("40");
  await expect(page).toHaveURL(/size=40/);
  const card = resultCards(page).filter({ hasText: OBI_TERM_ID }).first();
  await expect(card).toBeVisible();
  return card;
}

async function expectVisibleCardOntologies(page: Page, ontologyId: string) {
  const cards = resultCards(page);
  const cardCount = await cards.count();
  expect(cardCount).toBeGreaterThan(0);
  for (let i = 0; i < cardCount; i++) {
    await expect(cards.nth(i).locator(".searchresult-ontology")).toContainText(
      new RegExp(`\\b${ontologyId}\\b`, "i"),
    );
  }
}

test("search result page shows result count and controls for assay", async ({
  page,
}) => {
  await gotoSearch(page);

  expect(await resultCount(page)).toBeGreaterThanOrEqual(4000);
  await expect(page.locator("#search-facet-container-box")).toContainText("Type");
  await expect(page.locator("#search-facet-container-box")).toContainText(
    "Ontologies",
  );
  await expect(page.locator("#search-facet-container-box")).toContainText(
    "Collections",
  );
  await expect(page.locator("#lang-list")).toBeVisible();
  await expect(page.locator("#list-result-per-page")).toBeVisible();
  await expect(page.locator(".pagination-holder")).toBeVisible();
});

test("search result facets and pagination are clickable and update counts and URL", async ({
  page,
}) => {
  await gotoSearch(page);
  const allResultsCount = await resultCount(page);

  await facetCheckbox(page, "class").check();
  await expect(page).toHaveURL(/[?&]type=class/);
  await page.reload();
  await expect(facetCheckbox(page, "class")).toBeChecked();
  await waitForResultCountBelow(page, allResultsCount);

  await expect(page.locator(".search-filter-tags")).toContainText("class");
  await page.locator(".search-filter-tags .remove-tag-icon").click();
  await expect(page).not.toHaveURL(/[?&]type=class/);

  await page.locator("#list-result-per-page").selectOption("20");
  await expect(page).toHaveURL(/[?&]size=20/);
  await expect
    .poll(() => resultCards(page).count(), { timeout: 15000 })
    .toBeGreaterThanOrEqual(20);

  await page.locator("#lang-list").selectOption("de");
  await expect(page).toHaveURL(/[?&]lang=de/);

  await page.locator(".pagination-end").first().click();
  await expect(page).toHaveURL(/[?&]page=2/);
});

test("search result card for OBI:0000070 contains expected metadata and links", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await gotoSearch(page);
  const card = await obiAssayCard(page);

  await expect(card.locator(".search-result-title")).toContainText("[class]");
  await expect(card.locator(".search-result-title h4")).not.toHaveText("");
  await expect(card.locator(".term-button")).toHaveText(OBI_TERM_ID);
  await expect(
    card.locator('button[aria-label="add this term to termsets"]'),
  ).toContainText("Set");
  await expect(card.locator(".searchresult-ontology")).toContainText(
    /Ontology:\s*obi/i,
  );
  await expect(card.locator(".also-in-design")).toContainText(/Also in:/);
  await expect(
    card.locator(".also-in-design .ontology-button", { hasText: /^VIBSO$/ }),
  ).toBeVisible();
  await expect(card.locator(".searchresult-card-description")).not.toHaveText("");

  const iri = await card.locator(".searchresult-iri").evaluate(
    (element) => element.childNodes[0].textContent?.trim() ?? "",
  );
  await card.locator('button[aria-label="Copy to clipboard"]').click();
  await expect
    .poll(() => page.evaluate(() => navigator.clipboard.readText()))
    .toBe(iri);

  const titleLink = card.locator(".search-result-title");
  await expect(titleLink).toHaveAttribute(
    "href",
    /\/ontologies\/obi\/terms\?iri=/,
  );
  await titleLink.click();
  await expect(page).toHaveURL(/\/ontologies\/obi\/terms\?iri=/);
});

test("search result ontology facet filters by keyword and can filter/unfilter vibso", async ({
  page,
}) => {
  await gotoSearch(page);
  const allResultsCount = await resultCount(page);

  await showVibsoOntologyFacet(page);

  await clickFacetCheckbox(page, "VIBSO");
  await expect(page).toHaveURL(/[?&]ontology=VIBSO/);

  await page.reload();
  await showVibsoOntologyFacet(page);
  await expect(facetCheckbox(page, "VIBSO")).toBeChecked();
  await waitForResultCountBelow(page, allResultsCount);
  await expectVisibleCardOntologies(page, "vibso");

  await showVibsoOntologyFacet(page);
  await clickFacetCheckbox(page, "VIBSO");
  await expect(page).not.toHaveURL(/[?&]ontology=VIBSO/);
  await expect
    .poll(() => resultCount(page), { timeout: 15000 })
    .toBeGreaterThan(1000);
});

test("search result ontology facet show more expands and collapses", async ({
  page,
}) => {
  await gotoSearch(page);

  const ontologyCheckboxes = page.locator(".ontology-facet-checkbox");
  await expect(ontologyCheckboxes).toHaveCount(5);
  const initialCount = await ontologyCheckboxes.count();
  await page.locator("#search-facet-show-more-ontology-btn a").click();
  await expect(page.locator("#search-facet-show-more-ontology-btn a")).toHaveText(
    /Show Less/,
  );
  expect(await ontologyCheckboxes.count()).toBeGreaterThan(initialCount);

  await page.locator("#search-facet-show-more-ontology-btn a").click();
  await expect(page.locator("#search-facet-show-more-ontology-btn a")).toHaveText(
    /Show More/,
  );
  await expect
    .poll(() => ontologyCheckboxes.count(), { timeout: 15000 })
    .toBe(initialCount);
});

test("search result collection facet filters, URL initializes facet, and clear all resets", async ({
  page,
}) => {
  await gotoSearch(page);
  const allResultsCount = await resultCount(page);

  await facetCheckbox(page, "NFDI4CHEM").check();
  await expect(page).toHaveURL(/[?&]collection=NFDI4CHEM/);
  await waitForResultCountBelow(page, allResultsCount);
  await expect(page.locator(".search-filter-tags")).toContainText("NFDI4CHEM");

  await gotoSearch(page, `q=${SEARCH_QUERY}&collection=NFDI4CHEM`);
  await expect(facetCheckbox(page, "NFDI4CHEM")).toBeChecked();
  await waitForResultCountBelow(page, allResultsCount);

  await page.locator(".clear-filter-link-box a").click();
  await expect(page).not.toHaveURL(/[?&]collection=NFDI4CHEM/);
  await expect(facetCheckbox(page, "NFDI4CHEM")).not.toBeChecked();
  await expect
    .poll(() => resultCount(page), { timeout: 15000 })
    .toBeGreaterThan(1000);
});

test("search result updates when search input changes to no-result query", async ({
  page,
}) => {
  await gotoSearch(page);

  const input = page.locator("#s-field");
  await input.fill("");
  await input.pressSequentially(EMPTY_QUERY);
  await page.locator(".search-btn").click();

  await expect(page).toHaveURL(new RegExp(`[?&]q=${EMPTY_QUERY}`));
  await expect(resultHeading(page)).toHaveText(
    `No search results for "${EMPTY_QUERY}"`,
  );
});
