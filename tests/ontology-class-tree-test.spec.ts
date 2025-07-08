import {test, expect} from '@playwright/test';

const BASE_URL = 'http://localhost:3000';
const TEST_ONTOLOGY = "VIBSO";
const TEST_ROOT_CLASS_IRI = "http://purl.obolibrary.org/obo/BFO_0000001";
const TEST_ROOT_CLASS_LABEL = "entity";


test(`Ontology (${TEST_ONTOLOGY}) class tree root terms`, async ({page}) => {
    await page.goto(BASE_URL + "/ts/ontologies/vibso/terms");
    const treeNodeLi = await page.locator(`[data-iri="${TEST_ROOT_CLASS_IRI}"]`);
    await expect(treeNodeLi).toBeVisible();
    // the test root class has children so the expand + icon has to be visible for it.
    await expect(treeNodeLi.locator("i.fa-plus").first()).toBeVisible();
    await expect(treeNodeLi.locator("div.li-label-text").first()).toHaveText(TEST_ROOT_CLASS_LABEL);
});