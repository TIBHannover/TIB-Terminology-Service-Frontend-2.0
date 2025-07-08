import {test, expect} from '@playwright/test';

const BASE_URL = 'http://localhost:3000';
const ONTOLOGY_SUGGESTION_IS_ENABLED = process.env.REACT_APP_ONTOLOGY_SUGGESTION === 'true';
const ONTOLOGY_SUGGESTION_ENDPOINT = "/ts/ontologysuggestion";


test('ontology list is loaded', async ({page}) => {
    await page.goto(BASE_URL + "/ts/ontologies?and=false&sortedBy=title&page=1&size=10");
    await expect(page.locator('body')).toContainText("Browse Ontologies");
});

(ONTOLOGY_SUGGESTION_IS_ENABLED ? test : test.skip)("ontology suggestion button exists", async ({page}) => {
    await page.goto(BASE_URL + "/ts/ontologies?and=false&sortedBy=title&page=1&size=10");
    await expect(page.locator(`a[href="${ONTOLOGY_SUGGESTION_ENDPOINT}"]`)).toBeVisible();
});

