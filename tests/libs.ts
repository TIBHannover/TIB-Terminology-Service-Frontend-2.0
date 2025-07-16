import {Page} from '@playwright/test';

export const BASE_URL = 'http://localhost:3000';

export async function isImageLoaded(page: Page, selectRule: string): Promise<boolean> {
    return await page.locator(selectRule).evaluate((img: HTMLImageElement) => {
        return img.complete && img.naturalWidth > 0;
    });
}
