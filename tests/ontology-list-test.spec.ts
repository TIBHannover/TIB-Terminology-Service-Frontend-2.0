import { test, expect, type Page } from "@playwright/test";
import {
  expectSortedAscending,
  expectSortedDescending,
  gotoPath,
  locatorTexts,
  numbersFromText,
  visibleCards,
} from "./libs";

const ONTOLOGY_SUGGESTION_IS_ENABLED =
  process.env.REACT_APP_ONTOLOGY_SUGGESTION === "true";
const ONTOLOGY_SUGGESTION_ENDPOINT = "/ontologysuggestion";
const COLLECTION_ID_TO_TEST = "NFDI4CHEM";
const NFDI4CHEM_COLLECTION_FACET_CHECKBOX_ID = "col-checkbox-NFDI4CHEM";
const SUBJECT_TO_TEST = "General";
const ONTOLOGY_ID_SELECTOR = ".ontology-card-title-section .ontology-button";
const ONTOLOGY_TITLE_SELECTOR = ".ontology-title-text-in-box";
const ONTOLOGY_DESCRIPTION_SELECTOR = ".ontology-card-description .trunc-text";
const ONTOLOGY_COLLECTION_SELECTOR = ".ontology-card-collection-name";
const ONTOLOGY_CLASS_COUNT_SELECTOR =
  ".ontology-card-meta-data .ontology-meta-data-field-span:has-text('Classes')";
const ONTOLOGY_PROPERTY_COUNT_SELECTOR =
  ".ontology-card-meta-data .ontology-meta-data-field-span:has-text('Properties')";
const ONTOLOGY_LOADED_SELECTOR =
  ".ontology-card-meta-data .ontology-meta-data-field-span:has-text('Loaded:')";

async function gotoOntologyList(
  page: Page,
  params = "and=false&sortedBy=title&page=1&size=10",
) {
  await gotoPath(page, `/ontologies?${params}`);
  await expect(ontologyListHeading(page)).toBeVisible();
}

function ontologyListHeading(page: Page) {
  return page.locator("#ontologyList-wrapper-div h3", {
    hasText: "Browse Ontologies",
  });
}

test("ontology list is loaded", async ({ page }) => {
  await gotoOntologyList(page);
  await expect(page.locator("body")).toContainText("Browse Ontologies");
});

(ONTOLOGY_SUGGESTION_IS_ENABLED ? test : test.skip)(
  "ontology suggestion button exists",
  async ({ page }) => {
    await gotoOntologyList(page);
    await expect(
      page.locator(`a[href="${ONTOLOGY_SUGGESTION_ENDPOINT}"]`),
    ).toBeVisible();
  },
);

test("ontology list collection facet is loaded", async ({ page }) => {
  await gotoOntologyList(page);
  await expect(
    page.locator("#" + NFDI4CHEM_COLLECTION_FACET_CHECKBOX_ID),
  ).toBeVisible();
  await expect(
    page.locator(`label[for="${NFDI4CHEM_COLLECTION_FACET_CHECKBOX_ID}"]`),
  ).toBeVisible();
});

test("ontology list result count is correct", async ({ page }) => {
  const size = 20;
  await gotoOntologyList(page, `and=false&sortedBy=title&page=1&size=${size}`);
  await expect(page.locator("div.result-card")).toHaveCount(size);
});

test("ontology list renders at least 200 complete ontology cards", async ({
  page,
}) => {
  await gotoOntologyList(page, "and=false&sortedBy=title&page=1&size=250");
  const cards = await visibleCards(page);
  const cardCount = await cards.count();

  expect(cardCount).toBeGreaterThanOrEqual(200);

  for (let i = 0; i < cardCount; i++) {
    const card = cards.nth(i);
    await expect(card.locator(ONTOLOGY_ID_SELECTOR)).not.toHaveText("");
    await expect(card.locator(ONTOLOGY_TITLE_SELECTOR)).not.toHaveText("");
    await expect(card.locator(ONTOLOGY_DESCRIPTION_SELECTOR)).not.toHaveText("");
    await expect(card.locator(".read-more-btn")).toHaveText("[Read more]");
    await expect(
      card.locator(`${ONTOLOGY_COLLECTION_SELECTOR} a`).first(),
    ).toBeVisible();
    await expect(card.locator(ONTOLOGY_CLASS_COUNT_SELECTOR)).toContainText(
      /\d+ Classes/,
    );
    await expect(card.locator(ONTOLOGY_PROPERTY_COUNT_SELECTOR)).toContainText(
      /\d+ Properties/,
    );
    await expect(card.locator(ONTOLOGY_LOADED_SELECTOR)).toContainText(
      /Loaded: (\d{4}-\d{2}-\d{2}|N\/A)/,
    );
  }
});

test("ontology list description read more expands and collapses", async ({
  page,
}) => {
  await gotoOntologyList(page);
  const firstCard = (await visibleCards(page)).first();
  const description = firstCard.locator(".trunc-text");
  const readMore = firstCard.locator(".read-more-btn");
  const truncatedText = await description.innerText();

  await expect(readMore).toHaveText("[Read more]");
  await readMore.click();
  await expect(readMore).toHaveText("[Read less]");
  await expect(description).not.toHaveText(truncatedText);

  await readMore.click();
  await expect(readMore).toHaveText("[Read more]");
  await expect(description).toHaveText(truncatedText);
});

test("ontology list sorting options are present and sort the list", async ({
  page,
}) => {
  await gotoOntologyList(page, "and=false&sortedBy=title&page=1&size=40");
  const sortDropdown = page.locator("#ontology-list-sorting");

  await expect(sortDropdown.locator("option")).toHaveText([
    "Title",
    "Prefix",
    "Classes Count",
    "Properties Count",
    "Individuals Count",
    "Date Loaded",
  ]);

  await sortDropdown.selectOption("ontologyId");
  await expect(page).toHaveURL(/sortedBy=ontologyId/);
  expectSortedAscending(
    await locatorTexts(await visibleCards(page), ONTOLOGY_ID_SELECTOR),
  );

  await sortDropdown.selectOption("numberOfClasses");
  await expect(page).toHaveURL(/sortedBy=numberOfClasses/);
  expectSortedDescending(
    numbersFromText(
      await locatorTexts(await visibleCards(page), ONTOLOGY_CLASS_COUNT_SELECTOR),
    ),
  );

  await sortDropdown.selectOption("numberOfProperties");
  await expect(page).toHaveURL(/sortedBy=numberOfProperties/);
  expectSortedDescending(
    numbersFromText(
      await locatorTexts(
        await visibleCards(page),
        ONTOLOGY_PROPERTY_COUNT_SELECTOR,
      ),
    ),
  );

  await sortDropdown.selectOption("loaded");
  await expect(page).toHaveURL(/sortedBy=loaded/);
  expectSortedAscending(
    (await locatorTexts(await visibleCards(page), ONTOLOGY_LOADED_SELECTOR)).map(
      (text) => text.replace("Loaded: ", ""),
    ),
  );
});

test("ontology list has collection and subject facets", async ({ page }) => {
  await gotoOntologyList(page);
  await expect(page.locator("#ontology-list-facet-grid")).toContainText(
    "Filter by Collection",
  );
  await expect(page.locator("#ontology-list-facet-grid")).toContainText(
    "Filter by Subject",
  );
  await expect(page.locator(`#subj-checkbox-${SUBJECT_TO_TEST}`)).toBeVisible();
});

test("ontology list filter by keyword", async ({ page }) => {
  const keyword = "vibso"; // this should only show the vibso ontology as the result
  await gotoOntologyList(page);
  const facetRow = page.locator("#ontologylist-search-grid");
  const filterInput = facetRow.locator("input");
  await expect(filterInput).toBeVisible();
  const ontoResultCard = page.locator(".result-card");
  await filterInput.fill(keyword);
  await expect(page).toHaveURL(/keyword=vibso/);
  await expect(ontoResultCard).toHaveCount(1);
  await expect(ontoResultCard.locator(ONTOLOGY_ID_SELECTOR)).toHaveText(
    new RegExp(keyword, "i"),
  );
});

test("ontology list filter by keyword in URL", async ({ page }) => {
  const keyword = "vibso"; // this should only show the vibso ontology as the result
  await gotoOntologyList(
    page,
    `and=false&sortedBy=title&page=1&size=10&keyword=${keyword}`,
  );
  const facetRow = page.locator("#ontologylist-search-grid");
  const filterInput = facetRow.locator("input");
  await expect(filterInput).toHaveValue(keyword);
  const ontoResultCard = page.locator(".result-card");
  await expect(ontoResultCard).toHaveCount(1);
  await expect(ontoResultCard.locator(ONTOLOGY_ID_SELECTOR)).toHaveText(
    new RegExp(keyword, "i"),
  );
});

test("ontology list result collection facet filter function", async ({
  page,
}) => {
  await gotoOntologyList(page);
  const expectedResultCount = await page
    .locator(`#facet-count-${COLLECTION_ID_TO_TEST}`)
    .innerHTML();
  await page.locator(`#col-checkbox-${COLLECTION_ID_TO_TEST}`).check();
  await expect(page).toHaveURL(
    new RegExp(`collection=${COLLECTION_ID_TO_TEST}`),
  );
  await expect(page.locator("body")).toContainText(
    `Browse Ontologies (${expectedResultCount})`,
  );
  const cards = await visibleCards(page);
  const cardCount = await cards.count();
  for (let i = 0; i < cardCount; i++) {
    await expect(cards.nth(i).locator(ONTOLOGY_COLLECTION_SELECTOR)).toContainText(
      /NFDI4Chem/i,
    );
  }
});

test("ontology list result collection facet filter from URL", async ({
  page,
}) => {
  await gotoOntologyList(
    page,
    `and=false&sortedBy=title&page=1&size=10&collection=${COLLECTION_ID_TO_TEST}`,
  );
  const expectedResultCount = await page
    .locator(`#facet-count-${COLLECTION_ID_TO_TEST}`)
    .innerHTML();
  await expect(
    page.locator(`#col-checkbox-${COLLECTION_ID_TO_TEST}`),
  ).toBeChecked();
  await expect(page.locator("body")).toContainText(
    `Browse Ontologies (${expectedResultCount})`,
  );
});

test("ontology list subject facet filters to fewer than 70 general ontologies", async ({
  page,
}) => {
  await gotoOntologyList(page);
  await page.locator(`#subj-checkbox-${SUBJECT_TO_TEST}`).check();
  await expect(page).toHaveURL(new RegExp(`subject=${SUBJECT_TO_TEST}`));
  await expect(page.locator(`#subj-checkbox-${SUBJECT_TO_TEST}`)).toBeChecked();

  const heading = await ontologyListHeading(page).innerText();
  const count = Number(heading.match(/\((\d+)\)/)?.[1]);
  expect(count).toBeLessThan(70);
});

test("ontology list subject facet is set from URL", async ({ page }) => {
  await gotoOntologyList(
    page,
    `and=false&sortedBy=title&page=1&size=10&subject=${SUBJECT_TO_TEST}`,
  );
  await expect(page.locator(`#subj-checkbox-${SUBJECT_TO_TEST}`)).toBeChecked();

  const heading = await ontologyListHeading(page).innerText();
  const count = Number(heading.match(/\((\d+)\)/)?.[1]);
  expect(count).toBeLessThan(70);
});

test("ontology list sort and page are set from URL and page change updates URL", async ({
  page,
}) => {
  await gotoOntologyList(page, "and=false&sortedBy=ontologyId&page=2&size=20");
  await expect(page.locator("#ontology-list-sorting")).toHaveValue("ontologyId");
  await expect(page.locator("#list-result-per-page")).toHaveValue("20");
  await expect(page.locator(".pagination-middle-btn.selected-page")).toHaveText(
    "2",
  );
  expectSortedAscending(
    await locatorTexts(await visibleCards(page), ONTOLOGY_ID_SELECTOR),
  );

  await page.locator(".pagination-end").first().click();
  await expect(page).toHaveURL(/page=3/);
  await expect(page.locator(".pagination-middle-btn.selected-page")).toHaveText(
    "3",
  );
});
