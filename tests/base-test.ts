import { JSONHandling } from '../utils/json-file';

import { test as baseTest } from '@playwright/test';
import { LoginPage, ProductPage,  CartPage, CheckoutPage, HomePage } from '../pages/index';

//Export
export { expect } from '@playwright/test';

type MyFixtures = {
    loginPage: LoginPage;
    productPage: ProductPage;
    cartPage: CartPage; 
    checkoutPage: CheckoutPage;
    homePage: HomePage;
}

export const test = baseTest.extend<MyFixtures>(
    {
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
    productPage: async ({ page }, use) => {
        await use(new ProductPage(page));
    },
    cartPage: async ({ page }, use) => {
        await use(new CartPage(page));
    },
    checkoutPage: async ({ page }, use) => {
        await use(new CheckoutPage(page));
    },
    homePage: async ({ page }, use) => {
        await use(new HomePage(page));
    }

});


export class BaseTest {

    loadDataInfo(filePath: string): any {
        const jh = new JSONHandling();
        const fullPath = `../data/${process.env.TEST_ENV}/${filePath}`; // Corrected path concatenation

        try {
            const dataInfo = jh.readJSONFile(fullPath);
            if (dataInfo) {
                console.log(`Data loaded successfully from file ${fullPath}`);
                return dataInfo;
            } else {
                console.error(`Error: Unable to read data from file ${fullPath}`);
            }
        } catch (error) {
            console.error(`Exception occurred while reading file ${fullPath}:`, error);
        }

        return null;
    }

}
