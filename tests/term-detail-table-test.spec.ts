import { test, expect, type Locator, type Page } from "@playwright/test";
import { gotoPath } from "./libs";

const TEST_ONTOLOGY = "VIBSO";
const TEST_ASSAY_CLASS_IRI = "http://purl.obolibrary.org/obo/OBI_0000070";

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

test(`Ontology (${TEST_ONTOLOGY}) assay term detail table`, async ({
  page,
}) => {
  await gotoPath(
    page,
    `/ontologies/vibso/terms?iri=${encodeURIComponent(
      TEST_ASSAY_CLASS_IRI,
    )}`,
  );

  await expect(metadataValue(page, "Label")).toContainText("assay");
  await expect(metadataValue(page, "Description")).toContainText(
    "A planned process that has the objective to produce",
  );
  await expect(metadataValue(page, "Imported From")).toContainText("OBI");
  await expect(metadataValue(page, "Also In")).toContainText("BCO");
  await expect(metadataValue(page, "Also In")).toContainText("VIBSO");
  await expect(metadataValue(page, "CURIE")).toContainText("OBI:0000070");
  await expect(metadataValue(page, "Term ID")).toContainText("OBI_0000070");
  await expect(metadataValue(page, "fullIRI")).toContainText(
    TEST_ASSAY_CLASS_IRI,
  );
  await expect(metadataValue(page, "Ontology")).toContainText("vibso");
  await expect(metadataValue(page, "SubClass Of")).toContainText(
    "obsolete planned process",
  );
  await expect(metadataValue(page, "SubClass Of")).toContainText(
    "realizes someValuesFrom evaluant role",
  );
  await expect(metadataValue(page, "SubClass Of")).toContainText(
    "has specified input someValuesFrom",
  );
  await expect(metadataValue(page, "SubClass Of")).toContainText(
    "has specified output someValuesFrom",
  );
  await expect(metadataValue(page, "SubClass Of")).toContainText(
    "achieves_planned_objective someValuesFrom assay objective",
  );
  await expect(metadataValue(page, "Equivalent to")).toContainText(
    "achieves_planned_objective someValuesFrom assay objective",
  );
  await expect(metadataValue(page, "Disjoint with")).toContainText("planning");
  await expect(metadataValue(page, "Disjoint with")).toContainText(
    "data transformation",
  );
  await expect(metadataValue(page, "Instances")).toContainText("Assay_A");
  await expect(metadataValue(page, "has curation status")).toContainText(
    "ready for release",
  );
  await expect(metadataValue(page, "editor preferred term")).toContainText(
    "assay",
  );
  await expect(metadataValue(page, "example of usage")).toContainText(
    "Assay the wavelength of light emitted by excited Neon atoms.",
  );
  await expect(metadataValue(page, "example of usage")).toContainText(
    "Count of geese flying over a house.",
  );
});
