import {test, expect} from '@playwright/test';

const BASE_URL = 'http://localhost:3000';
const ONTOLOGY_SUGGESTION_IS_ENABLED = process.env.REACT_APP_ONTOLOGY_SUGGESTION === 'true';
const ONTOLOGY_SUGGESTION_ENDPOINT = "/ts/ontologysuggestion";
const COLLECTION_ID_TO_TEST = "NFDI4CHEM";
const NFDI4CHEM_COLLECTION_FACET_CHECKBOX_ID = "col-checkbox-NFDI4CHEM";


test('ontology list is loaded', async ({page}) => {
    await page.goto(BASE_URL + "/ts/ontologies?and=false&sortedBy=title&page=1&size=10");
    await expect(page.locator('body')).toContainText("Browse Ontologies");
});

(ONTOLOGY_SUGGESTION_IS_ENABLED ? test : test.skip)("ontology suggestion button exists", async ({page}) => {
    await page.goto(BASE_URL + "/ts/ontologies?and=false&sortedBy=title&page=1&size=10");
    await expect(page.locator(`a[href="${ONTOLOGY_SUGGESTION_ENDPOINT}"]`)).toBeVisible();
});

test('ontology list collection facet is loaded', async ({page}) => {
    await page.goto(BASE_URL + "/ts/ontologies?and=false&sortedBy=title&page=1&size=10");
    await expect(page.locator("#" + NFDI4CHEM_COLLECTION_FACET_CHECKBOX_ID)).toBeVisible();
    await expect(page.locator(`label[for="${NFDI4CHEM_COLLECTION_FACET_CHECKBOX_ID}"]`)).toBeVisible();
})

test('ontology list result count is correct', async ({page}) => {
    const size = 20;
    await page.goto(BASE_URL + `/ts/ontologies?and=false&sortedBy=title&page=1&size=${size}`);
    await expect(page.locator("div.result-card")).toHaveCount(size);
})

test('ontology list filter by keyword', async ({page}) => {
    const keyword = "vibso"; // this should only show the vibso ontology as the result
    await page.goto(BASE_URL + `/ts/ontologies?and=false&sortedBy=title&page=1&size=10`);
    const facetRow = await page.locator("#ontologylist-search-grid");
    const filterInput = await facetRow.locator('input');
    await expect(filterInput).toBeVisible();
    const ontoResultCard = await page.locator('.result-card');
    await filterInput.fill(keyword);
    await expect(ontoResultCard).toHaveCount(1);
});


test('ontology list filter by keyword in URL', async ({page}) => {
    const keyword = "vibso"; // this should only show the vibso ontology as the result
    await page.goto(BASE_URL + `/ts/ontologies?and=false&sortedBy=title&page=1&size=10&keyword=${keyword}`);
    const facetRow = await page.locator("#ontologylist-search-grid");
    const filterInput = await facetRow.locator('input');
    await expect(filterInput).toHaveValue(keyword);
    const ontoResultCard = await page.locator('.result-card');
    await expect(ontoResultCard).toHaveCount(1);
});

test('ontology list result collection facet filter function', async ({page}) => {
    await page.goto(BASE_URL + `/ts/ontologies?and=false&sortedBy=title&page=1&size=10`);
    const expectedResultCount = await page.locator(`#result-count-${COLLECTION_ID_TO_TEST}`).innerHTML();
    await page.locator(`#col-checkbox-${COLLECTION_ID_TO_TEST}`).check();
    await expect(page.locator("body")).toContainText(`Browse Ontologies (${expectedResultCount})`);
});

test('ontology list result collection facet filter from URL', async ({page}) => {
    await page.goto(BASE_URL + `/ts/ontologies?and=false&sortedBy=title&page=1&size=10&collection=${COLLECTION_ID_TO_TEST}`);
    const expectedResultCount = await page.locator(`#result-count-${COLLECTION_ID_TO_TEST}`).innerHTML();
    await expect(page.locator(`#col-checkbox-${COLLECTION_ID_TO_TEST}`)).toBeChecked();
    await expect(page.locator("body")).toContainText(`Browse Ontologies (${expectedResultCount})`);
})
