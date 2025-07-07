import {test, expect} from '@playwright/test';


test('ontology list is loaded', async ({page}) => {
    await page.goto("http://localhost:3000/ts/ontologies?and=false&sortedBy=title&page=1&size=10");
    await expect(page.locator('body')).toContainText("Browse Ontologies");
});