import {Page} from "@playwright/test";

export class Helper {
    static async takeScreenshot(page: Page, name: string) {
        const filePath = `screenshots/${name}.png`;
        await page.screenshot({ path: filePath, fullPage: true });
        console.log(`Screenshot saved: ${filePath}`);
    }
}