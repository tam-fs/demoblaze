import { CheckoutData, Product, User, Category } from "../../interfaces/demoblaze-interface";
import { readJson } from "../../utils/readJson";
import { test, expect } from "../base-test";

const user = readJson<User>("demoblaze/users.json");
const products = readJson<Product[]>("demoblaze/products.json");
const checkouts = readJson<CheckoutData[]>("demoblaze/checkouts.json");
test.beforeEach(async ({ loginPage, homePage, productPage, cartPage }) => {
    await productPage.navigateToHomePage();
    await loginPage.login(user.username, user.password);
    await homePage.verifyWelcomeMessage(user.username);
    await homePage.goToCart();
    await cartPage.clearCart();
    await homePage.clickHome();
  });
// TC5 - Full Shopping Flow
test("TC5 - Full flow - login add checkout logout - completes end-to-end successfully", async ({ loginPage, homePage, productPage, cartPage, checkoutPage}) => {
  
  // Add Sony vaio i5 (Laptops)
  const sonyProduct = products[4];
  await homePage.selectCategory(Category.Laptops);
  await homePage.selectProduct(sonyProduct.name);
  const sonyPrice = await productPage.getProductPrice();
  await productPage.addToCart();

  // Back Home -> Monitors -> Apple monitor 24
  await homePage.clickHome();
  await homePage.selectCategory(Category.Monitors);
  const appleProduct = products[5];
  await homePage.selectProduct(appleProduct.name);
  const applePrice = await productPage.getProductPrice();
  await productPage.addToCart();

  // Go to cart and verify both present
  await homePage.goToCart();
  await cartPage.verifyCartItemCount(2);

  const expectedTotal = sonyPrice + applePrice;
  await cartPage.verifyTotal(expectedTotal);

  // Place order and checkout (use reasonable data from testcase)
  await cartPage.clickPlaceOrder();
  const checkoutData = checkouts[1];
  await checkoutPage.completePurchase(checkoutData);
 
  await homePage.verifyAtHomeByUrl();

  // Logout and verify login button visible again
  await loginPage.logout();
  await loginPage.verifyLogoutSuccess();
});
