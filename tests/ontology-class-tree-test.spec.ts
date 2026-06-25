import { expect, test, type Locator, type Page } from "@playwright/test";
import { gotoPath } from "./libs";

const TEST_ONTOLOGY = "VIBSO";
const ROOT_CLASS_IRI = "http://purl.obolibrary.org/obo/BFO_0000001";
const ROOT_CLASS_LABEL = "entity";
const ASSAY_CLASS_IRI = "http://purl.obolibrary.org/obo/OBI_0000070";
const ASSAY_CLASS_LABEL = "assay";
const ASSAY_CLASS_DESCRIPTION =
  "A planned process that has the objective to produce information about a material entity";

async function gotoClassTree(page: Page) {
  await gotoPath(page, "/ontologies/vibso/terms?lang=en");
  await expect(page.locator(".is-loading-term-list")).toBeHidden({
    timeout: 30000,
  });
  await expect(treeRoot(page)).toBeVisible();
}

function treeRoot(page: Page) {
  return page.locator("#tree-root-ul");
}

function treeNodes(page: Page) {
  return treeRoot(page).locator(".tree-node-li");
}

function treeNode(page: Page, iri: string) {
  return page.locator(`[data-iri="${iri}"]`).first();
}

function nodeLabel(node: Locator) {
  return node.locator(".tree-text-container").first();
}

function detailRows(page: Page) {
  return page.locator(".node-detail-table-row");
}

async function expectTermDetail(page: Page, label: string) {
  await expect(
    detailRows(page)
      .filter({ hasText: "Label" })
      .filter({ hasText: label })
      .first(),
  ).toBeVisible({ timeout: 30000 });
}

async function selectEntity(page: Page) {
  const entity = treeNode(page, ROOT_CLASS_IRI);
  await nodeLabel(entity).click();
  await expectTermDetail(page, ROOT_CLASS_LABEL);
  return entity;
}

async function jumpToAssay(page: Page) {
  const jumpToInput = page.getByPlaceholder("type your target term ...");
  await jumpToInput.fill(ASSAY_CLASS_LABEL);
  await expect(page.locator(".react-autosuggest__suggestion").first()).toBeVisible();
  await page
    .locator(".react-autosuggest__suggestion", {
      hasText: new RegExp(`^${ASSAY_CLASS_LABEL}$`, "i"),
    })
    .first()
    .click();
  await expectTermDetail(page, ASSAY_CLASS_LABEL);
}

test.describe(`Ontology (${TEST_ONTOLOGY}) class tree`, () => {
  test("initial tree loads controls, obsoletes toggle, and expandable entity node", async ({
    page,
  }) => {
    await gotoClassTree(page);

    expect(await treeNodes(page).count()).toBeGreaterThanOrEqual(3);
    await expect(page.getByPlaceholder("type your target term ...")).toBeVisible();
    await expect(page.getByRole("button", { name: "Show Obsoletes" })).toBeVisible();

    const entity = treeNode(page, ROOT_CLASS_IRI);
    await expect(entity).toBeVisible();
    await expect(nodeLabel(entity)).toContainText(ROOT_CLASS_LABEL);
    await expect(entity.locator("i.fa-plus").first()).toBeVisible();

    await entity.locator("i.fa-plus").first().click();
    await expect(entity).toHaveClass(/opened/);
    await expect(entity.locator("i.fa-minus").first()).toBeVisible();
    await expect(entity.locator("> ul .tree-node-li").first()).toBeVisible();

    await entity.locator("i.fa-minus").first().click();
    await expect(entity).toHaveClass(/closed/);
    await expect(entity.locator("i.fa-plus").first()).toBeVisible();

    await nodeLabel(entity).click();
    await expectTermDetail(page, ROOT_CLASS_LABEL);
    await expect(page.getByRole("button", { name: "Reset" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Sub Tree" })).toBeVisible();

    await page.getByRole("button", { name: "Show Obsoletes" }).click();
    await expect(page.getByRole("button", { name: "Hide Obsoletes" })).toBeVisible();
    await expect(treeRoot(page).locator("s").first()).toBeVisible();

    await page.getByRole("button", { name: "Hide Obsoletes" }).click();
    await expect(page.getByRole("button", { name: "Show Obsoletes" })).toBeVisible();
    await expect(treeRoot(page).locator("s")).toHaveCount(0);
  });

  test("reset clears selected term and hides detail table", async ({ page }) => {
    await gotoClassTree(page);
    await selectEntity(page);

    await page.getByRole("button", { name: "Reset" }).click();
    await expect(page.locator(".tree-text-container.clicked")).toHaveCount(0);
    await expect(page.locator("#page-right-pane")).toBeHidden();
    await expect(page.getByRole("button", { name: "Reset" })).toBeHidden();
  });

  test("sub tree mode keeps selected term visible without children", async ({
    page,
  }) => {
    await gotoClassTree(page);
    await selectEntity(page);

    await page.getByRole("button", { name: "Sub Tree" }).click();
    const entity = treeNode(page, ROOT_CLASS_IRI);
    await expect(entity).toBeVisible({ timeout: 30000 });
    await expect(nodeLabel(entity)).toHaveClass(/clicked/);
    await expect(entity.locator("> ul .tree-node-li")).toHaveCount(0);
  });

  test("jump to assay renders assay subtree, detail table, and siblings", async ({
    page,
  }) => {
    await gotoClassTree(page);
    await jumpToAssay(page);

    const assay = treeNode(page, ASSAY_CLASS_IRI);
    await expect(assay).toBeVisible({ timeout: 30000 });
    await expect(nodeLabel(assay)).toHaveClass(/clicked/);
    await expectTermDetail(page, ASSAY_CLASS_LABEL);
    await expect(
      detailRows(page)
        .filter({ hasText: "Description" })
        .filter({ hasText: ASSAY_CLASS_DESCRIPTION })
        .first(),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Show Siblings" })).toBeVisible();

    const initialNodeCount = await treeNodes(page).count();
    await page.getByRole("button", { name: "Show Siblings" }).click();
    await expect(page.getByRole("button", { name: "Hide Siblings" })).toBeVisible({
      timeout: 30000,
    });
    expect(await treeNodes(page).count()).toBeGreaterThan(initialNodeCount);
  });

  test("keyboard navigation selects, expands, and collapses tree nodes", async ({
    page,
  }) => {
    await gotoClassTree(page);

    await nodeLabel(treeNode(page, ROOT_CLASS_IRI)).click();
    const selected = treeNode(page, ROOT_CLASS_IRI);
    await page.keyboard.press("ArrowRight");
    await expect(selected.first()).toHaveClass(/opened/);
    await expect(selected.first().locator("i.fa-minus").first()).toBeVisible();

    await page.keyboard.press("ArrowLeft");
    await expect(selected.first()).toHaveClass(/closed/);
    await expect(selected.first().locator("i.fa-plus").first()).toBeVisible();

    const selectedText = await page
      .locator(".tree-text-container.clicked .li-label-text")
      .innerText();
    await page.keyboard.press("ArrowDown");
    await expect(
      page.locator(".tree-text-container.clicked .li-label-text"),
    ).not.toHaveText(selectedText);
    await page.keyboard.press("ArrowUp");
    await expect(
      page.locator(".tree-text-container.clicked .li-label-text"),
    ).toHaveText(selectedText);
  });

  test("vertical resize line drags the tree and detail panes", async ({ page }) => {
    await gotoClassTree(page);
    await selectEntity(page);

    const resizeLine = page.locator(".page-resize-vertical-line");
    await expect(resizeLine).toBeVisible();
    const leftPane = page.locator("#page-left-pane");
    const initialWidth = await leftPane.evaluate((element) =>
      getComputedStyle(element).width,
    );
    const box = await resizeLine.boundingBox();
    expect(box).not.toBeNull();

    await resizeLine.dispatchEvent("mousedown", {
      clientX: box!.x + box!.width / 2,
    });
    await page.locator("body").dispatchEvent("mousemove", {
      clientX: box!.x + 80,
    });
    await page.locator("body").dispatchEvent("mouseup");

    await expect
      .poll(() =>
        leftPane.evaluate((element) => getComputedStyle(element).width),
      )
      .not.toBe(initialWidth);
  });
});
