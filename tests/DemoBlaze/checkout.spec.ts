import { CheckoutData, Product, User } from "../../interfaces/demoblaze-interface";
import { readJson } from "../../utils/readJson";
import { test, expect } from "../base-test";

const products = readJson<Product[]>("demoblaze/products.json");
const user = readJson<User>("demoblaze/users.json");
const checkouts = readJson<CheckoutData[]>("demoblaze/checkouts.json");
test.beforeEach(async ({ page, loginPage, homePage, productPage, cartPage, checkoutPage }) => {
    await productPage.navigateToHomePage();
    await loginPage.login(user.username, user.password);
    await homePage.verifyWelcomeMessage(user.username);
    await homePage.goToCart();
    await cartPage.clearCart();
    await homePage.clickHome();
  });
// TC3 - Checkout - Place Order with Valid Info
test("TC3 - Checkout - valid checkout info - shows confirmation with order id and amount", async ({ loginPage, homePage, productPage, cartPage, checkoutPage }) => {

  const target = products.find(p => p.name && p.price) || products[0];
  await homePage.selectProduct(target.name);
  await productPage.addToCart();

  await homePage.goToCart();
  await cartPage.clickPlaceOrder();

  const checkoutData = checkouts[0];
  await checkoutPage.fillCheckoutForm(checkoutData);

  await checkoutPage.clickPurchase();

  await checkoutPage.verifyOrderConfirmation();
  const orderId = await checkoutPage.getOrderId();
  const amount = await checkoutPage.getOrderAmount();
  await checkoutPage.verifyInformation(orderId, amount);

  await checkoutPage.closeConfirmation();
  //await homePage.navigateToHomePage();
  await homePage.clickHome();
  await homePage.goToCart();
  await cartPage.verifyCleared();
});
