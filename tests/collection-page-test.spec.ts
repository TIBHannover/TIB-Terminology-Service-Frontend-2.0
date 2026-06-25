import { expect, test, type Locator, type Page } from "@playwright/test";
import collectionsInfoJson from "../src/assets/collectionsText.json";
import { expectImageLoaded, gotoPath } from "./libs";

type CollectionTestData = {
  id: string;
  name: string;
  project_homepage?: string;
};

const collectionsInfo = collectionsInfoJson as Record<string, CollectionTestData>;

async function gotoCollections(page: Page, query = "") {
  await gotoPath(page, `/collections${query}`);
  await expect(collectionCards(page).first()).toBeVisible();
  await expect(
    page.locator(".collection-ontologies-loading").first(),
  ).toBeHidden({ timeout: 30000 });
}

function collectionCards(page: Page) {
  return page.locator(".collection-card-row");
}

function cardByCollectionId(page: Page, collectionId: string) {
  return page.locator(`[id="section_${collectionId}"]`);
}

function ontologyLinks(card: Locator) {
  return card.locator(".collection-ontologies-list .ontologies-link-tag");
}

test.describe("collection page", () => {
  test("collection cards are loaded with required content and ontology controls", async ({
    page,
  }) => {
    await gotoCollections(page);

    const cards = collectionCards(page);
    await expect(cards).toHaveCount(Object.keys(collectionsInfo).length);

    for (const [collectionId, collection] of Object.entries(collectionsInfo)) {
      const card = cardByCollectionId(page, collectionId);
      await expect(card).toBeVisible();

      const logoLink = card.locator(".collection-image-anchor");
      await expectImageLoaded(logoLink.locator("img.collection-logo-in-list"));
      const encodedCollectionId = encodeURIComponent(collection.id).replace(
        /%20/g,
        "(\\+|%20)",
      );
      await expect(logoLink).toHaveAttribute(
        "href",
        new RegExp(`/ontologies\\?.*collection=${encodedCollectionId}`),
      );

      const titleLink = card.locator(".collection-content a").first();
      await expect(titleLink).toHaveText(collection.name);
      await expect(titleLink).toHaveAttribute("href", /\/collections\/.+/);

      await expect(card.locator(".collection-content p").first()).not.toHaveText("");

      if (collection.project_homepage) {
        await expect(card).toContainText("Project Homepage:");
        await expect(
          card.locator(`a[href="${collection.project_homepage}"]`),
        ).toBeVisible();
      }

      const ontologies = ontologyLinks(card);
      await expect(ontologies.first()).toBeVisible();
      expect(await ontologies.count()).toBeGreaterThanOrEqual(1);

      await expect(
        card.getByRole("link", {
          name: "Suggest an ontology for this collection",
        }),
      ).toHaveAttribute("href", `/ontologysuggestion?col=${collectionId}`);
    }
  });

  test("collection title and logo links navigate to their target pages", async ({
    page,
  }) => {
    await gotoCollections(page);

    const essCard = cardByCollectionId(page, "ESS");
    await essCard.locator(".collection-content h4").click();
    await expect(page).toHaveURL(/\/collections\/ess$/);
    await expect(page.locator("body")).toContainText("Earth System Sciences");

    await gotoCollections(page);
    await cardByCollectionId(page, "ESS").locator(".collection-image-anchor").click();
    await expect(page).toHaveURL(/\/ontologies\?/);
    await expect(page).toHaveURL(/[?&]collection=ESS/);
  });

  test("show more expands long ontology lists and changes to show less", async ({
    page,
  }) => {
    await gotoCollections(page);

    const cards = collectionCards(page);
    let cardWithMoreButton: Locator | undefined;
    for (let i = 0; i < (await cards.count()); i++) {
      const card = cards.nth(i);
      if ((await card.getByRole("button", { name: "Show more" }).count()) > 0) {
        cardWithMoreButton = card;
        break;
      }
    }
    expect(cardWithMoreButton).toBeDefined();

    await expect(ontologyLinks(cardWithMoreButton!)).toHaveCount(8);
    await cardWithMoreButton!
      .getByRole("button", { name: "Show more" })
      .click();
    await expect(
      cardWithMoreButton!.getByRole("button", { name: "Show less" }),
    ).toBeVisible();
    expect(await ontologyLinks(cardWithMoreButton!).count()).toBeGreaterThan(8);
  });

  test("col query parameter scrolls the requested collection to the top", async ({
    page,
  }) => {
    await gotoCollections(page, "?col=ESS");

    await expect
      .poll(() =>
        cardByCollectionId(page, "ESS").evaluate((element) =>
          Math.round(element.getBoundingClientRect().top),
        ),
      )
      .toBeLessThanOrEqual(60);
    expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
  });
});
