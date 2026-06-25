import { test } from "@playwright/test";
import { expectImageLoaded, gotoPath } from "./libs";


test("TIB general collection are loaded on Homepage", async ({ page }) => {
  await gotoPath(page);
  await expectImageLoaded(page.locator("img[src='/NFDI4CHEM_LOGO.svg']"));
});
