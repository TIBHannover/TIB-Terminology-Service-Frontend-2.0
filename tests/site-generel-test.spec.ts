import {test, expect} from '@playwright/test';
import {BASE_URL, isImageLoaded} from "./libs";


test("TIB general collection are loaded on Homepage", async ({page}) => {
    await page.goto(BASE_URL + process.env.REACT_APP_PROJECT_SUB_PATH);
    const nfdi4chemImageIsLoaded = await isImageLoaded(page, "img[src='/NFDI4CHEM_LOGO.svg']");
    expect(nfdi4chemImageIsLoaded).toBe(true);

});
