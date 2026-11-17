import { expect, test, type Page } from "@playwright/test";
import { gotoPath, seedAuthenticatedUser } from "./libs";

type Follow = {
  ontology_id: string;
  notify_note: boolean;
  notify_issue: boolean;
  notify_publication: boolean;
  notify_github: boolean;
};

async function mockProfile(page: Page) {
  const state = {
    follows: ["chmo", "obi", "local"].map((ontology_id): Follow => ({
      ontology_id,
      notify_note: true,
      notify_issue: false,
      notify_publication: true,
      notify_github: false,
    })),
    patches: [] as Partial<Follow>[],
    failures: new Set<string>(),
  };
  await seedAuthenticatedUser(page);
  await page.route("**/user/validate_login/", (route) => route.fulfill({ json: { _result: { valid: true } } }));
  await page.route("**/admin/is_system_admin/", (route) => route.fulfill({ json: { _result: { is_system_admin: false } } }));
  await page.route("**/term_set/get/", (route) => route.fulfill({ json: { _result: { term_sets: [] } } }));
  await page.route("**/v2/health", (route) => route.fulfill({ body: "API is Accessible!" }));
  await page.route("**/v2/ontologies?**", (route) => route.fulfill({
    json: { elements: state.follows.map(({ ontology_id }) => ({
      ontologyId: ontology_id,
      title: ontology_id,
      repo_url: ontology_id === "local" ? "" : `https://github.com/example/${ontology_id}`,
    })) },
  }));
  await page.route("**/user/email/", async (route) => {
    const body = route.request().method() === "PUT" ? route.request().postDataJSON() : {};
    await route.fulfill({ json: { _result: { email: body.email ?? "mock@example.com", email_verified: true } } });
  });
  await page.route("**/user/apikey/get/", (route) => route.fulfill({
    json: { _result: { api_keys: [{ id: "1", title: "Mock API key", name: "mock", description: "Test key" }] } },
  }));
  await page.route("**/ontology_follow/", async (route) => {
    if (route.request().method() === "GET") {
      await route.fulfill({ json: { _result: { follows: state.follows } } });
      return;
    }
    const patch = route.request().postDataJSON() as Partial<Follow>;
    state.patches.push(patch);
    if (state.failures.has(patch.ontology_id)) {
      await route.fulfill({ status: 500, json: {} });
      return;
    }
    Object.assign(state.follows.find((follow) => follow.ontology_id === patch.ontology_id), patch);
    await route.fulfill({ json: { _result: { following: true } } });
  });
  return state;
}

test.describe("profile settings", () => {
  test.skip(process.env.REACT_APP_AUTH_FEATURE !== "true" || process.env.REACT_APP_ONTOLOGY_FOLLOW_FEATURE !== "true",
    "Profile notifications require authentication and ontology following.");

  test("moves settings into profile navigation and removes dropdown entries", async ({ page }) => {
    await mockProfile(page);
    await gotoPath(page, "/myprofile");
    const navigation = page.getByRole("navigation", { name: "Profile", exact: true });
    await expect(navigation.getByRole("link")).toHaveText(["Info", "Notifications", "API key"]);
    await expect(navigation.getByRole("link", { name: "Info", exact: true })).toHaveAttribute("aria-current", "page");
    await expect(page.getByRole("heading", { name: "Info", exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Email", exact: true })).toHaveCount(0);
    await page.getByRole("button", { name: "Mock User", exact: true }).click();
    const dropdown = page.locator(".dropdown-menu.show");
    await expect(dropdown.getByRole("link", { name: "My Profile", exact: true })).toBeVisible();
    await expect(dropdown.getByRole("link", { name: "API Key", exact: true })).toHaveCount(0);
    await expect(dropdown.getByRole("link", { name: "Followed ontologies", exact: true })).toHaveCount(0);
    await page.getByRole("button", { name: "Mock User", exact: true }).click();
    await navigation.getByRole("link", { name: "Notifications", exact: true }).click();
    await expect(page).toHaveURL(/\/myprofile\/notifications$/);
    await expect(page.getByLabel("Email address", { exact: true })).toHaveValue("mock@example.com");
    await expect(page.getByRole("table", { name: "Notification preferences for followed ontologies" })).toBeVisible();
    await page.getByLabel("Email address", { exact: true }).fill("updated@example.com");
    await page.getByRole("button", { name: "Update email", exact: true }).click();
    await expect(page.getByText("Notification email saved.", { exact: true })).toBeVisible();
    await navigation.getByRole("link", { name: "API key", exact: true }).click();
    await expect(page).toHaveURL(/\/myprofile\/apikey$/);
    await expect(page.getByRole("cell", { name: "Mock API key", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Create new API key" })).toBeVisible();
    await page.reload();
    await expect(navigation.getByRole("link", { name: "API key", exact: true })).toHaveAttribute("aria-current", "page");
  });

  test("waits for API keys before rendering the populated list", async ({ page }) => {
    await mockProfile(page);
    let release!: () => void;
    const pending = new Promise<void>((resolve) => { release = resolve; });
    await page.route("**/user/apikey/get/", async (route) => {
      await pending;
      await route.fulfill({ json: { _result: { api_keys: [{ id: "1", title: "Delayed API key", name: "mock", description: "Test key" }] } } });
    });
    await gotoPath(page, "/myprofile/apikey");
    await expect(page.getByRole("status")).toHaveText("Loading API keys…");
    await expect(page.getByRole("alert")).toHaveCount(0);
    await expect(page.getByRole("table")).toHaveCount(0);
    release();
    await expect(page.getByRole("cell", { name: "Delayed API key", exact: true })).toBeVisible();
    await expect(page.getByRole("table")).toBeVisible();
    await expect(page.getByRole("status")).toHaveCount(0);
    await expect(page.getByRole("alert")).toHaveCount(0);
  });

  test("shows an empty API key message without a table and keeps key creation available", async ({ page }, testInfo) => {
    await mockProfile(page);
    let release!: () => void;
    let pending = new Promise<void>((resolve) => { release = resolve; });
    await page.route("**/user/apikey/get/", async (route) => {
      await pending;
      await route.fulfill({ json: { _result: { api_keys: [] } } });
    });
    await gotoPath(page, "/myprofile/apikey");
    const alert = page.getByRole("alert");
    await expect(page.getByRole("status")).toHaveText("Loading API keys…");
    await expect(alert).toHaveCount(0);
    await expect(page.getByRole("table")).toHaveCount(0);
    release();
    await expect(alert).toHaveClass(/\balert-info\b/);
    await expect(alert.getByText("You have no API keys yet. Create a new key to access the API.", { exact: true })).toBeVisible();
    await expect(page.getByRole("table")).toHaveCount(0);
    const create = alert.getByRole("button", { name: "Create new API key", exact: true });
    await expect(create).toBeVisible();
    await page.screenshot({ path: testInfo.outputPath("empty-api-key-desktop.png"), fullPage: true });
    await create.click();
    await expect(page.getByRole("heading", { name: "Create a new API key.", exact: true })).toBeVisible();
    await expect(page.getByPlaceholder("Enter the title of the API key", { exact: true })).toBeVisible();
    pending = new Promise<void>((resolve) => { release = resolve; });
    await page.getByRole("button", { name: "Back to list", exact: true }).click();
    await expect(page.getByRole("status")).toHaveText("Loading API keys…");
    await expect(alert).toHaveCount(0);
    release();
    await expect(alert).toHaveClass(/\balert-info\b/);
    await expect(page.getByRole("table")).toHaveCount(0);
    await page.setViewportSize({ width: 390, height: 844 });
    await expect(create).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.screenshot({ path: testInfo.outputPath("empty-api-key-mobile.png"), fullPage: true });
  });

  test("redirects legacy settings URLs", async ({ page }) => {
    await mockProfile(page);
    await gotoPath(page, "/followed-ontologies");
    await expect(page.getByRole("heading", { name: "Email", exact: true })).toBeVisible({ timeout: 15000 });
    await expect(page).toHaveURL(/\/myprofile\/notifications$/, { timeout: 15000 });
    await gotoPath(page, "/apikey");
    await expect(page.getByRole("cell", { name: "Mock API key", exact: true })).toBeVisible({ timeout: 15000 });
    await expect(page).toHaveURL(/\/myprofile\/apikey$/, { timeout: 15000 });
  });

  test("shows a success alert for five seconds after the latest individual save", async ({ page }) => {
    await mockProfile(page);
    await gotoPath(page, "/myprofile/notifications");
    const notes = page.getByRole("checkbox", { name: "Notes for chmo", exact: true });
    await expect(notes).toBeChecked();
    await page.clock.install();
    await page.clock.pauseAt(new Date());
    await notes.click();
    await expect(notes).not.toBeChecked();
    const alert = page.locator('[role="status"] .alert-success');
    await expect(alert).toHaveText("Notification preferences saved.");
    await page.clock.fastForward(4000);
    await notes.click();
    await expect(notes).toBeChecked();
    await expect(alert).toBeVisible();
    await page.clock.fastForward(4999);
    await expect(alert).toBeVisible();
    await page.clock.fastForward(1);
    await expect(alert).toHaveCount(0);
  });

  test("enables and disables every preference column, skipping unsupported GitHub repositories", async ({ page }) => {
    const state = await mockProfile(page);
    await gotoPath(page, "/myprofile/notifications");
    for (const label of ["Notes", "Issues / term requests", "Publications", "GitHub activity"]) {
      const toggleAll = page.getByRole("checkbox", { name: `Toggle all ${label}`, exact: true });
      const eligible = label === "GitHub activity" ? ["chmo", "obi"] : ["chmo", "obi", "local"];
      const first = page.getByRole("checkbox", { name: `${label} for chmo`, exact: true });
      await expect(toggleAll).toBeEnabled();
      await expect(toggleAll).toHaveJSProperty("indeterminate", false);
      if (label === "Notes" || label === "Publications") {
        await expect(toggleAll).toBeChecked();
        await toggleAll.click();
      }
      for (const ontology of eligible) {
        await expect(page.getByRole("checkbox", { name: `${label} for ${ontology}`, exact: true })).not.toBeChecked();
      }
      await expect(toggleAll).toHaveJSProperty("checked", false);
      await first.click();
      await expect(first).toBeChecked();
      await expect(toggleAll).toHaveJSProperty("checked", false);
      await expect(toggleAll).toHaveJSProperty("indeterminate", true);
      await toggleAll.click();
      for (const ontology of eligible) {
        await expect(page.getByRole("checkbox", { name: `${label} for ${ontology}`, exact: true })).toBeChecked();
      }
      await expect(toggleAll).toBeChecked();
      await expect(toggleAll).toHaveJSProperty("indeterminate", false);
      await toggleAll.click();
      for (const ontology of eligible) {
        await expect(page.getByRole("checkbox", { name: `${label} for ${ontology}`, exact: true })).not.toBeChecked();
      }
      await expect(toggleAll).toHaveJSProperty("checked", false);
      await expect(toggleAll).toHaveJSProperty("indeterminate", false);
    }
    await expect(page.getByRole("checkbox", { name: "GitHub activity for local", exact: true })).toBeDisabled();
    expect(state.patches.filter((patch) => patch.ontology_id === "local" && patch.notify_github === true)).toHaveLength(0);
    await page.reload();
    await expect(page.getByRole("checkbox", { name: "Notes for chmo", exact: true })).not.toBeChecked();
  });

  test("keeps successful bulk saves and retries only failed preferences", async ({ page }) => {
    const state = await mockProfile(page);
    state.failures.add("obi");
    await gotoPath(page, "/myprofile/notifications");
    const toggleAll = page.getByRole("checkbox", { name: "Toggle all Issues / term requests", exact: true });
    await toggleAll.click();
    await expect(page.locator(".alert-danger")).toHaveText("Could not save notification preferences for 1 ontologies. Please try again.");
    await expect(page.getByRole("checkbox", { name: "Issues / term requests for chmo", exact: true })).toBeChecked();
    await expect(page.getByRole("checkbox", { name: "Issues / term requests for local", exact: true })).toBeChecked();
    await expect(page.getByRole("checkbox", { name: "Issues / term requests for obi", exact: true })).not.toBeChecked();
    await expect(toggleAll).toHaveJSProperty("indeterminate", true);
    await expect(toggleAll).toBeEnabled();
    state.failures.clear();
    state.patches.length = 0;
    await toggleAll.click();
    await expect(page.locator('[role="status"] .alert-success')).toBeVisible();
    await expect(page.locator(".alert-danger")).toHaveCount(0);
    expect(state.patches).toEqual([{ ontology_id: "obi", notify_issue: true }]);
    await expect(toggleAll).toBeChecked();
    await expect(toggleAll).toHaveJSProperty("indeterminate", false);
  });

  test("keeps profile navigation vertical and the notifications table contained on mobile", async ({ page }, testInfo) => {
    await mockProfile(page);
    await gotoPath(page, "/myprofile/notifications");
    const navigation = page.getByRole("navigation", { name: "Profile", exact: true });
    await expect(page.getByRole("checkbox", { name: "Notes for chmo", exact: true })).toBeVisible();
    const navBox = await navigation.boundingBox();
    const contentBox = await page.getByRole("heading", { name: "Notifications", exact: true }).boundingBox();
    expect(navBox.x + navBox.width).toBeLessThanOrEqual(contentBox.x + 2);
    const emailHeading = page.getByRole("heading", { name: "Email", exact: true });
    const ontologiesHeading = page.getByRole("heading", { name: "Ontologies", exact: true });
    expect(Math.abs((await emailHeading.boundingBox()).x - (await ontologiesHeading.boundingBox()).x)).toBeLessThanOrEqual(1);
    await page.screenshot({ path: testInfo.outputPath("profile-notifications-desktop.png"), fullPage: true });
    await page.setViewportSize({ width: 390, height: 844 });
    const links = navigation.getByRole("link");
    const first = await links.nth(0).boundingBox();
    const second = await links.nth(1).boundingBox();
    expect(second.y).toBeGreaterThan(first.y);
    expect(Math.abs((await emailHeading.boundingBox()).x - (await ontologiesHeading.boundingBox()).x)).toBeLessThanOrEqual(1);
    const table = page.getByRole("table", { name: "Notification preferences for followed ontologies" });
    const tableContainer = page.locator(".table-responsive", { has: table });
    await expect(tableContainer).toBeVisible();
    expect(await table.evaluate((element) => element.getBoundingClientRect().width)).toBeGreaterThanOrEqual(700);
    expect(await tableContainer.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(true);
    await page.screenshot({ path: testInfo.outputPath("profile-notifications-mobile.png"), fullPage: true });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });
});
