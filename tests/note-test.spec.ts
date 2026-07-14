import {
  expect,
  test,
  type APIRequestContext,
  type Locator,
  type Page,
} from "@playwright/test";
import {
  gotoPath,
  mockNoteTermLookups,
  seedAuthenticatedUser,
} from "./libs";

const ONTOLOGY_ID = "chmo";
const MOCK_BACKEND_URL = "http://localhost:3001";

async function fillEditor(container: Locator, text: string) {
  const editor = container.locator(".rdw-editor-main").first();
  await editor.click();
  await editor.locator('[contenteditable="true"]').fill(text);
}

async function selectAboutTerm(modal: Locator, page: Page, term: string) {
  const input = modal.getByPlaceholder("type your target term ...");
  await input.fill(term);
  await page
    .locator(".react-autosuggest__suggestion", { hasText: term })
    .first()
    .click();
}

async function openNoteMenu(noteCard: Locator) {
  await noteCard.locator(".note-dropdown-toggle").click();
  await expect(noteCard.locator(".dropdown-menu")).toBeVisible();
}

async function resetMockBackend(request: APIRequestContext) {
  await request.post(`${MOCK_BACKEND_URL}/__reset`);
}

async function gotoNoteListFromOntologyPage(page: Page) {
  await gotoPath(page, `/ontologies/${ONTOLOGY_ID}?lang=en`);
  const notesTab = page
    .locator(".ontology-detail-nav-item .nav-link", { hasText: /^Notes/ })
    .first();
  await expect(notesTab).toContainText("Notes (1)");
  await notesTab.click();
  await expect(page).toHaveURL(/\/ontologies\/chmo\/notes/);
  await expect(page.locator(".is-loading-term-list")).toBeHidden();
}

async function gotoNoteList(page: Page) {
  await gotoPath(page, `/ontologies/${ONTOLOGY_ID}/notes?lang=en`);
  await expect(page.locator(".is-loading-term-list")).toBeHidden();
}

test.describe("note feature", () => {
  test.describe.configure({ mode: "serial" });

  test.beforeEach(async ({ context, page, request }) => {
    await resetMockBackend(request);
    await context.grantPermissions(["clipboard-write"], {
      origin: "http://localhost:3000",
    });
    await seedAuthenticatedUser(page);
    await mockNoteTermLookups(page);
  });

  test("note list renders cards and actions", async ({ page }) => {
    await gotoNoteListFromOntologyPage(page);
    const noteCard = page.locator(".note-list-card").first();
    await expect(noteCard.getByRole("link", { name: "Mock CHMO note" }))
      .toHaveAttribute("href", /noteId=1/);
    await expect(noteCard).toContainText("Opened on");
    await expect(noteCard).toContainText("mock_user");
    await expect(noteCard).toContainText("About (class):");
    await expect(noteCard.getByRole("link", { name: "assay" }))
      .toHaveAttribute("href", /\/ontologies\/chmo\/terms\?iri=/);
    await expect(noteCard.locator(".fa-comment")).toContainText("1");

    await openNoteMenu(noteCard);
    await expect(noteCard.locator(".dropdown-menu")).toContainText("public");
    await noteCard.locator("button", { hasText: "Link" }).click();
    await expect(noteCard).toContainText("link copied");
    await openNoteMenu(noteCard);
    await expect(noteCard.locator("button", { hasText: "Report" }))
      .toBeVisible();
    await expect(noteCard.locator("button", { hasText: "Edit" }))
      .toBeVisible();
    await expect(noteCard.locator("button", { hasText: "Delete" }))
      .toBeVisible();
  });

  test("creates a note and opens its detail page", async ({ page }) => {
    await gotoNoteList(page);
    await page.getByRole("button", { name: "Add Note" }).click();
    const createModal = page.locator("#edit-note-modal-add-note");
    await expect(createModal).toBeVisible();
    await createModal.locator("#note-artifact-types").selectOption("2");
    await createModal.locator("#note_visibility_dropdown").selectOption("3");
    await selectAboutTerm(createModal, page, "assay");
    await expect(createModal.locator("#publish_note_to_parent_checkbox"))
      .not.toBeChecked();
    await createModal.locator("#noteTitle-add-note").fill("Created CHMO note");
    await fillEditor(createModal, "Created note content");
    await createModal.getByRole("button", { name: "Submit" }).click();

    await expect(page).toHaveURL(/\/ontologies\/chmo\/notes.*noteId=2/);
    await expect(page.getByText("Your Note is submitted successfully!"))
      .toBeVisible();
    await expect(page.locator(".card-title.note-list-title"))
      .toHaveText("Created CHMO note");
    await expect(page.locator(".card-text")).toContainText(
      "Created note content",
    );
    await expect(page.locator(".note-comment-container")).toBeVisible();
  });

  test("updates a note from the note card menu", async ({ page }) => {
    await gotoNoteList(page);
    const noteCard = page
      .locator(".note-list-card", { hasText: "Mock CHMO note" })
      .first();
    await openNoteMenu(noteCard);
    await noteCard.locator("button", { hasText: "Edit" }).click();
    const editModal = page.locator("#edit-note-modal1");
    await expect(editModal).toBeVisible();
    await editModal.locator("#note-artifact-types").selectOption("2");
    await editModal.locator("#note_visibility_dropdown").selectOption("2");
    await selectAboutTerm(editModal, page, "assay output");
    await expect(editModal.locator("#publish_note_to_parent_checkbox"))
      .not.toBeChecked();
    await editModal.locator("#noteTitle1").fill("Updated CHMO note");
    await fillEditor(editModal, "Updated note content");
    await editModal.getByRole("button", { name: "Submit" }).click();

    await expect(page.locator(".note-list-card", { hasText: "Updated CHMO note" }))
      .toBeVisible();
    await expect(page.locator(".note-list-card", { hasText: "assay output" }))
      .toBeVisible();
  });

  test("deletes a note from the note card menu", async ({ page }) => {
    await gotoNoteList(page);
    const noteCard = page
      .locator(".note-list-card", { hasText: "Mock CHMO note" })
      .first();
    await openNoteMenu(noteCard);
    await noteCard.locator("button", { hasText: "Delete" }).click();
    const deleteModal = page.locator("#deleteModal1");
    await expect(deleteModal).toContainText(
      "Are you sure you want to delete this item?",
    );
    await deleteModal.getByRole("button", { name: "Delete" }).click();
    await expect(deleteModal).toContainText("Deleted successfully!");
    await deleteModal.getByRole("button", { name: "Close" }).click();

    await expect(page.locator(".note-list-card", { hasText: "Mock CHMO note" }))
      .toHaveCount(0);
    await expect(page.getByText("This Ontology does not have any note yet."))
      .toBeVisible();
  });

  test("note detail shows content and allows commenting", async ({ page }) => {
    await gotoPath(page, `/ontologies/${ONTOLOGY_ID}/notes?noteId=1&lang=en`);
    await expect(page.locator(".card-title.note-list-title"))
      .toHaveText("Mock CHMO note");
    await expect(page.locator(".card-text").first()).toContainText(
      "Existing note content",
    );
    await expect(page.locator(".note-comment-container")).toBeVisible();
    await expect(page.locator(".note-comment-card")).toContainText(
      "Existing comment",
    );

    await fillEditor(
      page.locator(".note-comment-editor-warpper"),
      "Created note comment",
    );
    await page.getByRole("button", { name: "Comment" }).click();
    await expect(
      page.locator(".note-comment-card", { hasText: "Created note comment" }),
    ).toBeVisible();
  });
});
