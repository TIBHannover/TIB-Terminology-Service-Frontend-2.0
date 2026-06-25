import { expect, test, type Locator, type Page } from "@playwright/test";
import ontologyPageTabs from "../src/components/Ontologies/OntologyPage/listOfComponentsAsTabs.json";
import { gotoPath } from "./libs";

const ONTOLOGY_ID = "vibso";
const ONTOLOGY_TITLE = "Vibrational Spectroscopy Ontology (VIBSO)";
const ONTOLOGY_PATH = `/ontologies/${ONTOLOGY_ID}?lang=en`;
const DESCRIPTION =
  "The Vibration Spectroscopy Ontology defines technical terms";

type TabConfig = {
  tabTitle: string;
  urlEndPoint: string;
};

async function gotoOntologyPage(page: Page) {
  await gotoPath(page, ONTOLOGY_PATH);
  await expect(page.locator(".is-loading-term-list")).toBeHidden({
    timeout: 30000,
  });
  await expect(page.locator(".ontology-page-container")).toBeVisible();
}

function metadataRow(page: Page, label: string) {
  return page.locator(".ontology-detail-table tr").filter({
    has: page
      .locator(".ontology-overview-table-id-column")
      .filter({ hasText: new RegExp(`^${label}$`) }),
  });
}

function metadataValue(page: Page, label: string) {
  return metadataRow(page, label).locator("td").nth(1);
}

async function expectUrlMetadata(page: Page, label: string) {
  const value = metadataValue(page, label);
  await expect(value.locator("a")).toHaveAttribute("href", /^https?:\/\//);
  await expect(
    value.getByRole("button", { name: "Copy to clipboard" }),
  ).toBeVisible();
}

async function metricValue(page: Page, label: string) {
  const row = page.locator(".ontology-metric-table tr").filter({
    has: page.locator(".ontology-overview-table-id-column", {
      hasText: new RegExp(`^${label}$`),
    }),
  });
  await expect(row).toBeVisible();
  return Number((await row.locator("td").nth(1).innerText()).trim());
}

function enabledTabConfigs() {
  return Object.entries(ontologyPageTabs as Record<string, TabConfig>).filter(
    ([key]) => {
      if (key === "Notes" && process.env.REACT_APP_NOTE_FEATURE !== "true") {
        return false;
      }
      if (
        key === "IssueList" &&
        process.env.REACT_APP_GITHUB_ISSUE_LIST_FEATURE !== "true"
      ) {
        return false;
      }
      return true;
    },
  );
}

test.describe("ontology page", () => {
  test("loads overview tab with title, description, metrics, metadata, and json link", async ({
    page,
  }) => {
    await gotoOntologyPage(page);

    const activeTab = page.locator(".ontology-detail-nav-item.nav-item-active");
    await expect(activeTab).toHaveText("Overview");
    await expect(page.getByText(ONTOLOGY_TITLE)).toHaveCount(2);
    await expect(page.locator(".ontology-page-headbar")).toContainText(
      ONTOLOGY_TITLE,
    );
    await expect(page.locator(".ontology-detail-text")).toContainText(
      ONTOLOGY_TITLE,
    );
    await expect(page.locator(".ontology-detail-text")).toContainText(
      DESCRIPTION,
    );

    expect(await metricValue(page, "Number of Classes")).toBeGreaterThan(0);
    expect(await metricValue(page, "Number of Properties")).toBeGreaterThan(0);
    expect(await metricValue(page, "Number of Individuals")).toBeGreaterThan(0);

    await expect(metadataValue(page, "Version")).not.toHaveText("");
    await expectUrlMetadata(page, "VersionIRI");
    await expectUrlMetadata(page, "IRI");
    await expectUrlMetadata(page, "HomePage");
    await expectUrlMetadata(page, "Issue tracker");

    const license = metadataValue(page, "License");
    await expect(license.locator("a")).toHaveAttribute("href", /^https?:\/\//);

    await expect(metadataValue(page, "Creator")).not.toHaveText("");
    await expect(metadataValue(page, "Creator")).not.toContainText(
      "Copy to clipboard",
    );

    const imports = metadataValue(page, "Imports").locator("a");
    await expect(imports.first()).toBeVisible();
    await expect(imports.first()).toHaveAttribute("href", /\/ontologies\//);

    const collections = metadataValue(page, "Collections").locator("a");
    await expect(collections.first()).toBeVisible();
    await expect(collections.first()).toHaveAttribute(
      "href",
      /\/ontologies\?.*collection=/,
    );

    await expect(metadataValue(page, "Subject")).toContainText(/chemistry/i);
    await expect(metadataValue(page, "Is Skos")).toHaveText("false");

    const downloadButton = metadataValue(page, "Download").locator(
      ".download-ontology-btn",
    );
    await expect(downloadButton.locator(".fa-download")).toBeVisible();
    await expect(downloadButton).toContainText("Ontology metadata as JSON");

    const metadataPagePromise = page.waitForEvent("popup");
    await page
      .getByRole("link", { name: "Show Ontology Metadata as JSON" })
      .click();
    const metadataPage = await metadataPagePromise;
    await expect(metadataPage).toHaveURL(/api\/v2\/ontologies\/vibso\?lang=en/);
    await metadataPage.close();
  });

  test("show more information expands and collapses additional metadata", async ({
    page,
  }) => {
    await gotoOntologyPage(page);

    const toggle = page.locator("#search-facet-show-more-ontology-btn a");
    await expect(toggle).toHaveText("+ Show more information");
    await toggle.click();
    await expect(toggle).toHaveText("- Show less");
    await expect(page.locator("#annotation-heading")).toContainText(
      "Additional information from Ontology source",
    );
  });

  test("loads configured tabs and activates each tab when clicked", async ({
    page,
  }) => {
    await gotoOntologyPage(page);

    for (const [, tab] of enabledTabConfigs()) {
      const tabLink = page
        .locator(".ontology-detail-nav-item .nav-link", {
          hasText: new RegExp(`^${tab.tabTitle}`),
        })
        .first();
      await expect(tabLink).toBeVisible();
      await tabLink.click();
      await expect(page).toHaveURL(
        new RegExp(`/ontologies/${ONTOLOGY_ID}${tab.urlEndPoint.replace("/", "\\/")}(\\?|$)`),
      );
      await expect(
        page.locator(".ontology-detail-nav-item.nav-item-active"),
      ).toContainText(tab.tabTitle);
    }
  });

  test("top bar has language selector and fullscreen toggle", async ({
    page,
  }) => {
    await gotoOntologyPage(page);

    await expect(page.locator("#onto-language")).toBeVisible();
    await expect(page.locator("#onto-language")).toHaveValue("en");

    const fullscreenButton = page.locator(".ontology-page-headbar button").last();
    await expect(fullscreenButton.locator('[title="Full screen"]')).toBeVisible();
    await fullscreenButton.click();
    await expect(
      fullscreenButton.locator('[title="Exit full screen"]'),
    ).toBeVisible();
    await fullscreenButton.click();
    await expect(fullscreenButton.locator('[title="Full screen"]')).toBeVisible();
  });
});
