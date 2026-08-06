import {
  expect,
  test,
  type Locator,
  type Page,
  type Route,
} from "@playwright/test";
import { BASE_URL, disableTourAndCookieBanner } from "./libs";

const ONTOLOGY_ID = "mathml-test";
const TERM_IRI = "http://example.test/terms/math-formula";
const MATH_PROPERTY_IRI = "http://example.test/properties/definingFormula";
const PLAIN_PROPERTY_IRI = "http://example.test/properties/plainAnnotation";
const MATH_ML = "<math><mtext>formula example</mtext></math>";

function metadataValue(page: Page, label: string): Locator {
  return page
    .locator(".node-detail-table-row")
    .filter({
      has: page
        .locator(".node-metadata-label")
        .filter({ hasText: new RegExp(`^${label}$`) }),
    })
    .locator(".node-metadata-value");
}

async function json(route: Route, body: unknown) {
  await route.fulfill({
    contentType: "application/json",
    body: JSON.stringify(body),
  });
}

function ontologyResponse() {
  return {
    ontologyId: ONTOLOGY_ID,
    iri: "http://example.test/ontology",
    title: "MathML Test Ontology",
    description: "Ontology fixture for MathML rendering",
    preferredPrefix: "MATHML",
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

function termResponse() {
  return {
    iri: TERM_IRI,
    label: ["Math formula term"],
    type: ["class"],
    ontologyId: ONTOLOGY_ID,
    ontologyPreferredPrefix: "MATHML",
    definedBy: [ONTOLOGY_ID],
    curie: "MATHML:001",
    shortForm: "MATHML_001",
    isObsolete: false,
    hasHierarchicalChildren: false,
    hasDirectChildren: false,
    hasDirectParents: false,
    definition: ["Term with a MathML annotation"],
    [MATH_PROPERTY_IRI]: MATH_ML,
    [PLAIN_PROPERTY_IRI]: "Plain annotation value",
    linkedEntities: {
      [MATH_PROPERTY_IRI]: {
        label: ["Defining Formula"],
        format: ["MathML"],
      },
      [PLAIN_PROPERTY_IRI]: {
        label: ["Plain Annotation"],
        format: ["Text"],
      },
    },
  };
}

async function mockMathMlTermRoutes(page: Page) {
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
      await json(route, termResponse());
      return;
    }

    if (url.pathname.includes(`/api/v2/ontologies/${ONTOLOGY_ID}/classes/`)) {
      await json(route, { elements: [], totalElements: 0 });
      return;
    }

    if (url.pathname.includes(`/api/ontologies/${ONTOLOGY_ID}/terms/`)) {
      await json(route, { _embedded: { individuals: [] } });
      return;
    }

    await json(route, {});
  });
}

test("term detail table renders MathML annotation with formula widget", async ({
  page,
}) => {
  await mockMathMlTermRoutes(page);

  await disableTourAndCookieBanner(page);
  await page.goto(
    `${BASE_URL}${process.env.REACT_APP_PROJECT_SUB_PATH}/ontologies/${ONTOLOGY_ID}/terms?iri=${encodeURIComponent(TERM_IRI)}`,
    { waitUntil: "domcontentloaded" },
  );

  await expect(metadataValue(page, "Label")).toContainText("Math formula term");

  const formula = metadataValue(page, "Defining Formula");
  await expect(formula).toContainText("No math formula available.");
  await expect(formula).not.toContainText("<math");

  const plainAnnotation = metadataValue(page, "Plain Annotation");
  await expect(plainAnnotation).toContainText("Plain annotation value");
  await expect(plainAnnotation.locator("math")).toHaveCount(0);
});
