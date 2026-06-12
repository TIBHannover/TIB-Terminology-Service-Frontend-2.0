import { test, expect } from "@playwright/test";

const BASE_URL = "http://localhost:3000";
const TEST_ONTOLOGY = "VIBSO";
const TEST_ROOT_CLASS_IRI = "http://purl.obolibrary.org/obo/BFO_0000001";
const TEST_ROOT_CLASS_LABEL = "entity";
const TEST_ASSAY_CLASS_IRI = "http://purl.obolibrary.org/obo/OBI_0000070";
const TEST_ASSAY_CLASS_LABEL = "assay";
const TEST_ASSAY_CLASS_DESCRIPTION =
  "A planned process that has the objective to produce information about a material entity";

test(`Ontology (${TEST_ONTOLOGY}) class tree root terms`, async ({ page }) => {
  await page.goto(BASE_URL + "/ontologies/vibso/terms");
  const treeNodeLi = await page.locator(`[data-iri="${TEST_ROOT_CLASS_IRI}"]`);
  await expect(treeNodeLi).toBeVisible();
  // the test root class has children so the expand + icon has to be visible for it.
  await expect(treeNodeLi.locator("i.fa-plus").first()).toBeVisible();
  await expect(treeNodeLi.locator("div.li-label-text").first()).toHaveText(
    TEST_ROOT_CLASS_LABEL,
  );
});

test(`Ontology (${TEST_ONTOLOGY}) class tree jump to assay`, async ({
  page,
}) => {
  await page.goto(BASE_URL + "/ontologies/vibso/terms");
  await page.waitForTimeout(1500);
  await page
    .locator("#___reactour")
    .getByRole("button", { name: "Close" })
    .click();
  await page.pause();
  const jumpToInput = page.getByPlaceholder("type your target term ...");
  await expect(jumpToInput).toBeVisible();
  await jumpToInput.fill(TEST_ASSAY_CLASS_LABEL);
  await jumpToInput.click();
  await jumpToInput.fill(TEST_ASSAY_CLASS_LABEL);
  await page.waitForTimeout(1000);
  await page.getByText(TEST_ASSAY_CLASS_LABEL, { exact: true }).click();
  await page.waitForTimeout(1500);
  const assayTreeNodeLi = page.locator(`[data-iri="${TEST_ASSAY_CLASS_IRI}"]`);
  await expect(assayTreeNodeLi).toBeVisible();
  await expect(assayTreeNodeLi.locator("i.fa-plus").first()).toBeVisible();
  await expect(assayTreeNodeLi.locator("div.li-label-text").first()).toHaveText(
    TEST_ASSAY_CLASS_LABEL,
  );

  const detailRows = page.locator(".node-detail-table-row");
  await expect(
    detailRows
      .filter({ hasText: "Label" })
      .filter({ hasText: TEST_ASSAY_CLASS_LABEL })
      .first(),
  ).toBeVisible();
  await expect(
    detailRows
      .filter({ hasText: "Description" })
      .filter({ hasText: TEST_ASSAY_CLASS_DESCRIPTION })
      .first(),
  ).toBeVisible();
});
