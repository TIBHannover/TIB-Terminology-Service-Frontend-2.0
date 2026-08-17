import { expect, test, type Page, type Route } from "@playwright/test";
import { gotoPath } from "./libs";

const ONTOLOGY_ID = "handle-obsoletes-test";
const ROOT_PAGE_0_IRI = "http://example.test/terms/root-page-0";
const ROOT_PAGE_1_IRI = "http://example.test/terms/root-page-1";
const ROOT_DE_PAGE_0_IRI = "http://example.test/terms/de-root-page-0";
const ROOT_DE_PAGE_1_IRI = "http://example.test/terms/de-root-page-1";
const PREFERRED_ROOT_PAGE_0_IRI =
  "http://example.test/terms/preferred-root-page-0";
const PREFERRED_ROOT_PAGE_1_IRI =
  "http://example.test/terms/preferred-root-page-1";
const OBSOLETE_ALPHA_IRI = "http://example.test/terms/obsolete-alpha";
const OBSOLETE_BETA_IRI = "http://example.test/terms/obsolete-beta";
const PROPERTY_PAGE_0_IRI = "http://example.test/properties/root-page-0";
const PROPERTY_PAGE_1_IRI = "http://example.test/properties/root-page-1";
const PROPERTY_DE_PAGE_0_IRI = "http://example.test/properties/de-root-page-0";
const PROPERTY_DE_PAGE_1_IRI = "http://example.test/properties/de-root-page-1";
const OBSOLETE_PROPERTY_ALPHA_IRI =
  "http://example.test/properties/obsolete-alpha";
const OBSOLETE_PROPERTY_BETA_IRI =
  "http://example.test/properties/obsolete-beta";

type RouteOptions = {
  delayOntologyMetadataLang?: string;
  delayInitialRoots?: boolean;
  delayInitialPropertyRoots?: boolean;
  delayNormalRootPage1?: boolean;
  delayPropertyRootPage1?: boolean;
  delayObsoleteRootPage0?: boolean;
  delayObsoleteRootPage1?: boolean;
  noActiveRoots?: boolean;
  rootTotalElements?: number;
  preferredRootTotalElements?: number;
  initialObsoletes?: boolean;
  obsoleteTotalElements?: number;
  propertyRootTotalElements?: number;
  obsoletePropertyTotalElements?: number;
};

function term(iri: string, label: string, isObsolete = false, type = "class") {
  return {
    iri,
    label: [label],
    type: [type],
    ontologyId: ONTOLOGY_ID,
    definedBy: [ONTOLOGY_ID],
    isObsolete,
    hasHierarchicalChildren: false,
    hasDirectChildren: false,
    hasDirectParents: false,
  };
}

function property(iri: string, label: string, isObsolete = false) {
  return term(iri, label, isObsolete, "property");
}

function obsoleteRootTerm(iri: string, label: string) {
  return {
    iri,
    label,
    ontology_name: ONTOLOGY_ID,
    ontology_prefix: "HOT",
    ontology_iri: "http://example.test/ontology",
    has_children: false,
    short_form: label.toUpperCase().replace(/\s+/g, "_"),
  };
}

function ontologyResponse() {
  return {
    ontologyId: ONTOLOGY_ID,
    iri: "http://example.test/ontology",
    title: "Handle Obsoletes Test Ontology",
    description: "Ontology fixture for obsolete root loading",
    preferredPrefix: "HOT",
    ontologyPurl: "http://example.test/ontology.owl",
    loaded: "2026-01-01",
    numberOfClasses: "1002",
    numberOfProperties: "0",
    numberOfIndividuals: "0",
    allow_download: true,
    classifications: [{ collection: [] }, { subject: ["chemistry"] }],
    homepage: "http://example.test",
    license: {
      label: "CC0",
      url: "http://example.test/license",
    },
    creator: ["TIB"],
    importsFrom: [],
    language: ["en", "de"],
    skos: false,
  };
}

async function json(route: Route, body: unknown) {
  await route.fulfill({
    contentType: "application/json",
    body: JSON.stringify(body),
  });
}

async function mockOntologyRoutes(page: Page, options: RouteOptions = {}) {
  const rootClassRequests: string[] = [];
  const obsoleteRootRequests: string[] = [];
  const rootPropertyRequests: string[] = [];
  const obsoletePropertyRootRequests: string[] = [];
  let releaseOntologyMetadata: (() => void) | undefined;
  const ontologyMetadataGate = new Promise<void>((resolve) => {
    releaseOntologyMetadata = resolve;
  });
  let releaseInitialRoots: (() => void) | undefined;
  const initialRootsGate = new Promise<void>((resolve) => {
    releaseInitialRoots = resolve;
  });
  let releaseInitialPropertyRoots: (() => void) | undefined;
  const initialPropertyRootsGate = new Promise<void>((resolve) => {
    releaseInitialPropertyRoots = resolve;
  });
  let releaseNormalRootPage1: (() => void) | undefined;
  const normalRootPage1Gate = new Promise<void>((resolve) => {
    releaseNormalRootPage1 = resolve;
  });
  let releasePropertyRootPage1: (() => void) | undefined;
  const propertyRootPage1Gate = new Promise<void>((resolve) => {
    releasePropertyRootPage1 = resolve;
  });
  let releaseObsoleteRootPage1: (() => void) | undefined;
  let releaseObsoleteRootPage0: (() => void) | undefined;
  const obsoleteRootPage0Gate = new Promise<void>((resolve) => {
    releaseObsoleteRootPage0 = resolve;
  });
  const obsoleteRootPage1Gate = new Promise<void>((resolve) => {
    releaseObsoleteRootPage1 = resolve;
  });

  await page.addInitScript(() => {
    window.localStorage.setItem("obsoletes", "false");
  });

  if (options.initialObsoletes) {
    await page.addInitScript(() => {
      window.localStorage.setItem("obsoletes", "true");
    });
  }

  await page.route(`**/v2/ontologies/${ONTOLOGY_ID}?**`, async (route) => {
    const url = new URL(route.request().url());
    if (url.searchParams.get("lang") === options.delayOntologyMetadataLang) {
      await ontologyMetadataGate;
    }
    await json(route, ontologyResponse());
  });

  await page.route(`**/v2/ontologies/${ONTOLOGY_ID}/classes?**`, async (route) => {
    const url = new URL(route.request().url());
    const includeObsolete = url.searchParams.get("includeObsoleteEntities");
    const isPreferredRoot = url.searchParams.get("isPreferredRoot") === "true";
    const pageNumber = Number(url.searchParams.get("page") ?? "0");
    const lang = url.searchParams.get("lang") ?? "en";

    if (includeObsolete === "true") {
      obsoleteRootRequests.push(url.toString());
      if (options.delayObsoleteRootPage0 && pageNumber === 0) {
        await obsoleteRootPage0Gate;
      }
      if (options.delayObsoleteRootPage1 && pageNumber === 1) {
        await obsoleteRootPage1Gate;
      }
      await json(route, {
        elements: [
          term(
            pageNumber === 0 ? OBSOLETE_ALPHA_IRI : OBSOLETE_BETA_IRI,
            lang === "de"
              ? pageNumber === 0
                ? "Veraltetes Alpha"
                : "Veraltetes Beta"
              : pageNumber === 0
                ? "Obsolete alpha"
                : "Obsolete beta",
            true,
          ),
        ],
        totalElements: options.obsoleteTotalElements ?? 1,
      });
      return;
    }

    rootClassRequests.push(url.toString());

    if (options.delayInitialRoots) {
      await initialRootsGate;
    }

    if (
      options.delayNormalRootPage1 &&
      !isPreferredRoot &&
      pageNumber === 1
    ) {
      await normalRootPage1Gate;
    }

    if (isPreferredRoot) {
      await json(route, {
        elements: [
          pageNumber === 0
            ? term(PREFERRED_ROOT_PAGE_0_IRI, "Preferred root page 0")
            : term(PREFERRED_ROOT_PAGE_1_IRI, "Preferred root page 1"),
        ],
        totalElements: options.preferredRootTotalElements ?? 1,
      });
      return;
    }

    await json(route, {
      elements: options.noActiveRoots
        ? []
        : [
            lang === "de"
              ? pageNumber === 0
                ? term(ROOT_DE_PAGE_0_IRI, "Sichtbare Wurzel Seite 0")
                : term(ROOT_DE_PAGE_1_IRI, "Sichtbare Wurzel Seite 1")
              : pageNumber === 0
                ? term(ROOT_PAGE_0_IRI, "Visible root page 0")
                : term(ROOT_PAGE_1_IRI, "Visible root page 1"),
          ],
      totalElements: options.noActiveRoots ? 0 : options.rootTotalElements ?? 1,
    });
  });

  await page.route(`**/${ONTOLOGY_ID}/classes/roots?**`, async (route) => {
    const url = new URL(route.request().url());
    obsoleteRootRequests.push(url.toString());
    const pageNumber = Number(url.searchParams.get("page") ?? "0");
    const obsoletes = url.searchParams.get("obsoletes");
    const lang = url.searchParams.get("lang") ?? "en";
    if (options.delayObsoleteRootPage0 && pageNumber === 0) {
      await obsoleteRootPage0Gate;
    }
    if (options.delayObsoleteRootPage1 && pageNumber === 1) {
      await obsoleteRootPage1Gate;
    }

    const obsoleteTermsByPage: Record<number, ReturnType<typeof obsoleteRootTerm>> = {
      0: obsoleteRootTerm(
        OBSOLETE_ALPHA_IRI,
        lang === "de" ? "Veraltetes Alpha" : "Obsolete alpha",
      ),
      1: obsoleteRootTerm(
        OBSOLETE_BETA_IRI,
        lang === "de" ? "Veraltetes Beta" : "Obsolete beta",
      ),
    };

    await json(route, {
      _embedded: {
        terms:
          obsoletes === "true"
            ? [obsoleteTermsByPage[pageNumber]]
            : [],
      },
      page: {
        totalElements: options.obsoleteTotalElements ?? 1,
      },
    });
  });

  await page.route(
    `**/v2/ontologies/${ONTOLOGY_ID}/properties?**`,
    async (route) => {
      const url = new URL(route.request().url());
      const includeObsolete = url.searchParams.get("includeObsoleteEntities");
      const pageNumber = Number(url.searchParams.get("page") ?? "0");
      const lang = url.searchParams.get("lang") ?? "en";

      if (includeObsolete === "true") {
        obsoletePropertyRootRequests.push(url.toString());
        await json(route, {
          elements: [
            property(
              pageNumber === 0
                ? OBSOLETE_PROPERTY_ALPHA_IRI
                : OBSOLETE_PROPERTY_BETA_IRI,
              lang === "de"
                ? pageNumber === 0
                  ? "Veraltete Eigenschaft Alpha"
                  : "Veraltete Eigenschaft Beta"
                : pageNumber === 0
                  ? "Obsolete property alpha"
                  : "Obsolete property beta",
              true,
            ),
          ],
          totalElements: options.obsoletePropertyTotalElements ?? 1,
        });
        return;
      }

      rootPropertyRequests.push(url.toString());

      if (options.delayInitialPropertyRoots && pageNumber === 0) {
        await initialPropertyRootsGate;
      }

      if (options.delayPropertyRootPage1 && pageNumber === 1) {
        await propertyRootPage1Gate;
      }

      await json(route, {
        elements: [
          lang === "de"
            ? pageNumber === 0
              ? property(PROPERTY_DE_PAGE_0_IRI, "Eigenschaft Wurzel Seite 0")
              : property(PROPERTY_DE_PAGE_1_IRI, "Eigenschaft Wurzel Seite 1")
            : pageNumber === 0
              ? property(PROPERTY_PAGE_0_IRI, "Property root page 0")
              : property(PROPERTY_PAGE_1_IRI, "Property root page 1"),
        ],
        totalElements: options.propertyRootTotalElements ?? 1,
      });
    },
  );

  await page.route(`**/${ONTOLOGY_ID}/properties/roots?**`, async (route) => {
    const url = new URL(route.request().url());
    obsoletePropertyRootRequests.push(url.toString());
    const pageNumber = Number(url.searchParams.get("page") ?? "0");
    const obsoletes = url.searchParams.get("obsoletes");
    const lang = url.searchParams.get("lang") ?? "en";

    await json(route, {
      _embedded: {
        terms:
          obsoletes === "true"
            ? [
                pageNumber === 0
                  ? obsoleteRootTerm(
                      OBSOLETE_PROPERTY_ALPHA_IRI,
                      lang === "de"
                        ? "Veraltete Eigenschaft Alpha"
                        : "Obsolete property alpha",
                    )
                  : obsoleteRootTerm(
                      OBSOLETE_PROPERTY_BETA_IRI,
                      lang === "de"
                        ? "Veraltete Eigenschaft Beta"
                        : "Obsolete property beta",
                    ),
              ]
            : [],
      },
      page: {
        totalElements: options.obsoletePropertyTotalElements ?? 1,
      },
    });
  });

  await page.route("**/ts/repos_list?**", async (route) => {
    await json(route, { _result: { repositories: [] } });
  });

  return {
    rootClassRequests,
    obsoleteRootRequests,
    rootPropertyRequests,
    obsoletePropertyRootRequests,
    releaseOntologyMetadata: () => releaseOntologyMetadata?.(),
    releaseInitialRoots: () => releaseInitialRoots?.(),
    releaseInitialPropertyRoots: () => releaseInitialPropertyRoots?.(),
    releaseNormalRootPage1: () => releaseNormalRootPage1?.(),
    releasePropertyRootPage1: () => releasePropertyRootPage1?.(),
    releaseObsoleteRootPage0: () => releaseObsoleteRootPage0?.(),
    releaseObsoleteRootPage1: () => releaseObsoleteRootPage1?.(),
  };
}

function urls(requests: string[]) {
  return requests.map((request) => new URL(request));
}

function pageNumbers(requests: URL[]) {
  return requests.map((url) => Number(url.searchParams.get("page") ?? "0"));
}

function uniquePageNumbers(requests: string[]) {
  return [...new Set(pageNumbers(urls(requests)))];
}

function normalRootRequests(requests: string[]) {
  return requests.filter(
    (request) => new URL(request).searchParams.get("isPreferredRoot") !== "true",
  );
}

function preferredRootRequests(requests: string[]) {
  return requests.filter(
    (request) => new URL(request).searchParams.get("isPreferredRoot") === "true",
  );
}

async function scrollTree(page: Page) {
  await page.locator("#page-left-pane").evaluate((element) => {
    element.scrollTop = element.scrollHeight;
    element.dispatchEvent(new Event("scroll", { bubbles: true }));
  });
}

async function rapidScrollTree(page: Page, times = 3) {
  await page.locator("#page-left-pane").evaluate(
    (element, count) => {
      element.scrollTop = element.scrollHeight;
      for (let i = 0; i < count; i++) {
        element.dispatchEvent(new Event("scroll", { bubbles: true }));
      }
    },
    times,
  );
}

test.describe("ontology obsolete root loading", () => {
  test("loads ontology metadata and active roots", async ({ page }) => {
    const routes = await mockOntologyRoutes(page);

    await gotoPath(page, `/ontologies/${ONTOLOGY_ID}/terms?lang=en`);

    await expect(page.locator(".ontology-page-headbar")).toContainText(
      "Handle Obsoletes Test Ontology",
    );
    await expect(page.locator("#tree-root-ul")).toBeVisible();
    await expect(page.locator(`[data-iri="${ROOT_PAGE_0_IRI}"]`)).toBeVisible();
    await expect(page.getByRole("button", { name: "Show Obsoletes" })).toBeVisible();
    expect(uniquePageNumbers(routes.rootClassRequests)).toEqual([0]);
    expect(routes.obsoleteRootRequests).toHaveLength(0);
  });

  test("loads obsolete class roots from persisted state", async ({ page }) => {
    const routes = await mockOntologyRoutes(page, { initialObsoletes: true });

    await gotoPath(page, `/ontologies/${ONTOLOGY_ID}/terms?lang=en`);

    await expect(page.getByRole("button", { name: "Hide Obsoletes" })).toBeVisible();
    await expect(page.locator(`[data-iri="${OBSOLETE_ALPHA_IRI}"] s`)).toHaveText(
      "Obsolete alpha",
    );
    expect(uniquePageNumbers(routes.rootClassRequests)).toEqual([0]);
    expect(uniquePageNumbers(routes.obsoleteRootRequests)).toEqual([0]);
    expect(
      urls(routes.obsoleteRootRequests).every(
        (url) =>
          url.searchParams.get("includeObsoleteEntities") === "true" &&
          url.searchParams.get("lang") === "en",
      ),
    ).toBe(true);
  });

  test("loads obsolete class roots from the obsoletes query param", async ({ page }) => {
    const routes = await mockOntologyRoutes(page);

    await gotoPath(page, `/ontologies/${ONTOLOGY_ID}/terms?lang=en&obsoletes=true`);

    await expect(page.getByRole("button", { name: "Hide Obsoletes" })).toBeVisible();
    await expect(page.locator(`[data-iri="${OBSOLETE_ALPHA_IRI}"] s`)).toHaveText(
      "Obsolete alpha",
    );
    expect(uniquePageNumbers(routes.obsoleteRootRequests)).toEqual([0]);
  });

  test("toggles obsolete class roots", async ({ page }) => {
    const routes = await mockOntologyRoutes(page);

    await gotoPath(page, `/ontologies/${ONTOLOGY_ID}/terms?lang=en`);

    await page.getByRole("button", { name: "Show Obsoletes" }).click();

    await expect(page.getByRole("button", { name: "Hide Obsoletes" })).toBeVisible();
    await expect(page.locator(`[data-iri="${OBSOLETE_ALPHA_IRI}"] s`)).toHaveText(
      "Obsolete alpha",
    );
    expect(pageNumbers(urls(routes.obsoleteRootRequests))).toEqual([0]);
  });

  test("loads property roots and obsolete property roots", async ({ page }) => {
    const routes = await mockOntologyRoutes(page);

    await gotoPath(page, `/ontologies/${ONTOLOGY_ID}/props?lang=en`);

    await expect(page.locator("#tree-root-ul")).toBeVisible();
    await expect(page.locator(`[data-iri="${PROPERTY_PAGE_0_IRI}"]`)).toBeVisible();
    await page.getByRole("button", { name: "Show Obsoletes" }).click();

    await expect(page.getByRole("button", { name: "Hide Obsoletes" })).toBeVisible();
    await expect(
      page.locator(`[data-iri="${OBSOLETE_PROPERTY_ALPHA_IRI}"] s`),
    ).toHaveText("Obsolete property alpha");
    expect(uniquePageNumbers(routes.rootPropertyRequests)).toEqual([0]);
    expect(uniquePageNumbers(routes.obsoletePropertyRootRequests)).toEqual([0]);
    expect(
      urls(routes.obsoletePropertyRootRequests).every(
        (url) =>
          url.searchParams.get("includeObsoleteEntities") === "true" &&
          url.searchParams.get("lang") === "en",
      ),
    ).toBe(true);
  });

  test("refreshes root labels after language changes", async ({ page }) => {
    const routes = await mockOntologyRoutes(page);

    await gotoPath(page, `/ontologies/${ONTOLOGY_ID}/terms?lang=en`);

    await expect(page.locator(`[data-iri="${ROOT_PAGE_0_IRI}"]`)).toBeVisible();
    await page.locator("#onto-language").selectOption("de");

    await expect(page.locator(`[data-iri="${ROOT_DE_PAGE_0_IRI}"]`)).toBeVisible();
    await expect(page.locator(`[data-iri="${ROOT_PAGE_0_IRI}"]`)).toHaveCount(0);
    expect(
      urls(normalRootRequests(routes.rootClassRequests)).some(
        (url) => url.searchParams.get("lang") === "de",
      ),
    ).toBe(true);
  });

  test("switches to preferred roots", async ({ page }) => {
    const routes = await mockOntologyRoutes(page);

    await gotoPath(page, `/ontologies/${ONTOLOGY_ID}/terms?lang=en`);

    await expect(page.locator(`[data-iri="${ROOT_PAGE_0_IRI}"]`)).toBeVisible();
    await page.getByRole("switch", { name: "Preferred roots" }).click();

    await expect(
      page.locator(`[data-iri="${PREFERRED_ROOT_PAGE_0_IRI}"]`),
    ).toBeVisible();
    await expect(page.locator(`[data-iri="${ROOT_PAGE_0_IRI}"]`)).toHaveCount(0);
    const preferredRequests = urls(preferredRootRequests(routes.rootClassRequests));
    expect(pageNumbers(preferredRequests)).toEqual([0]);
    expect(
      preferredRequests.every(
        (url) =>
          url.searchParams.get("includeObsoleteEntities") === "false" &&
          url.searchParams.get("isPreferredRoot") === "true" &&
          url.searchParams.get("lang") === "en",
      ),
    ).toBe(true);
  });
});
