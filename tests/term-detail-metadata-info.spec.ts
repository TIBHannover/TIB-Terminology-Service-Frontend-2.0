import {
  expect,
  test,
  type Locator,
  type Page,
  type Route,
} from "@playwright/test";
import { BASE_URL, disableTourAndCookieBanner } from "./libs";

const ONTOLOGY_ID = "metadata-link-test";
const TERM_IRI = "http://example.test/terms/annotated-term";
const PROPERTY_IRI = "http://example.test/properties/sourceAnnotation";
const UNSAFE_PROPERTY_IRI = "javascript:alert(1)";

function metadataRow(page: Page, label: string): Locator {
  return page.locator(".node-detail-table-row").filter({
    has: page
      .locator(".node-metadata-label")
      .filter({ hasText: new RegExp(`^${label}$`) }),
  });
}

async function json(route: Route, body: unknown, status = 200) {
  await route.fulfill({
    status,
    contentType: "application/json",
    body: JSON.stringify(body),
  });
}

function ontologyResponse() {
  return {
    ontologyId: ONTOLOGY_ID,
    iri: "http://example.test/ontology",
    title: "Metadata Link Test Ontology",
    description: "Ontology fixture for metadata info links",
    preferredPrefix: "METADATA",
    ontologyPurl: "http://example.test/ontology.owl",
    loaded: "2026-01-01",
    numberOfClasses: "1",
    numberOfProperties: "0",
    numberOfIndividuals: "0",
    allow_download: true,
    classifications: [{ collection: [] }, { subject: ["chemistry"] }],
    importsFrom: [],
    language: ["en"],
    skos: false,
  };
}

function termResponse(propertyIri = PROPERTY_IRI) {
  return {
    iri: TERM_IRI,
    label: ["Annotated term"],
    type: ["class"],
    ontologyId: ONTOLOGY_ID,
    ontologyPreferredPrefix: "METADATA",
    definedBy: [ONTOLOGY_ID],
    curie: "METADATA:001",
    shortForm: "METADATA_001",
    isObsolete: false,
    hasHierarchicalChildren: false,
    hasDirectChildren: false,
    hasDirectParents: false,
    definition: ["Term with annotation metadata"],
    [propertyIri]: "Source annotation value",
    linkedEntities: {
      [propertyIri]: {
        label: ["source annotation"],
        format: ["Text"],
      },
    },
  };
}

async function mockMetadataTermRoutes(
  page: Page,
  {
    propertyIri = PROPERTY_IRI,
  }: { propertyIri?: string } = {},
) {
  await page.route("https://api.terminology.tib.eu/api/**", async (route) => {
    await json(route, {}, 404);
  });

  await page.route("**/api/**", async (route) => {
    const url = new URL(route.request().url());

    if (url.pathname === `/api/v2/ontologies/${ONTOLOGY_ID}`) {
      await json(route, ontologyResponse());
      return;
    }

    if (url.pathname === `/api/v2/ontologies/${ONTOLOGY_ID}/classes`) {
      await json(route, { elements: [], totalElements: 0 });
      return;
    }

    if (url.pathname === `/api/v2/ontologies/${ONTOLOGY_ID}/properties`) {
      await json(route, { elements: [], totalElements: 0 });
      return;
    }

    if (
      url.pathname.startsWith(
        `/api/v2/ontologies/${ONTOLOGY_ID}/entities/`,
      )
    ) {
      await json(route, termResponse(propertyIri));
      return;
    }

    if (url.pathname.includes(`/api/ontologies/${ONTOLOGY_ID}/terms/`)) {
      await json(route, { _embedded: { individuals: [] } });
      return;
    }

    await json(route, {});
  });
}

async function gotoMetadataTerm(page: Page) {
  await disableTourAndCookieBanner(page);
  await page.goto(
    `${BASE_URL}${process.env.REACT_APP_PROJECT_SUB_PATH}/ontologies/${ONTOLOGY_ID}/terms?iri=${encodeURIComponent(TERM_IRI)}`,
    { waitUntil: "domcontentloaded" },
  );
}

async function openMetadataInfoModal(page: Page) {
  const row = metadataRow(page, "source annotation");
  await expect(row.locator(".node-metadata-value")).toContainText(
    "Source annotation value",
  );

  const cells = row.locator(":scope > .row > div");
  await expect(cells).toHaveCount(3);
  await expect(cells.nth(2)).toHaveClass(/metadata-info-cell/);

  const infoButton = cells
    .nth(2)
    .getByRole("button", {
      name: "Show source annotation metadata information",
    });
  await expect(infoButton).toBeVisible();

  await infoButton.click();

  const dialog = page.locator(".metadata-info-modal .modal-dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText("source annotation");
  return dialog;
}

test("annotation metadata info icon opens modal and falls back to property IRI link", async ({
  page,
}) => {
  await mockMetadataTermRoutes(page);
  await gotoMetadataTerm(page);

  const labelRow = metadataRow(page, "Label");
  await expect(labelRow.locator(".metadata-info-cell button")).toHaveCount(0);

  const dialog = await openMetadataInfoModal(page);

  const fallbackLink = dialog.locator("a.metadata-info-iri");
  await expect(fallbackLink).toHaveText(PROPERTY_IRI, { timeout: 15000 });
  await expect(fallbackLink).toHaveAttribute("href", PROPERTY_IRI);
  await expect(fallbackLink).toHaveAttribute("target", "_blank");
  await expect(dialog).not.toContainText(/no information available/i);
});

test("metadata fallback renders unsafe property IRI as text", async ({
  page,
}) => {
  await mockMetadataTermRoutes(page, { propertyIri: UNSAFE_PROPERTY_IRI });
  await gotoMetadataTerm(page);

  const dialog = await openMetadataInfoModal(page);
  const fallbackText = dialog.locator("span.metadata-info-iri");
  await expect(fallbackText).toHaveText(UNSAFE_PROPERTY_IRI, {
    timeout: 15000,
  });
  await expect(dialog.locator("a.metadata-info-iri")).toHaveCount(0);
});
