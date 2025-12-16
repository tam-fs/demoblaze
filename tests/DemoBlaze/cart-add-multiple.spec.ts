import { Product, User, Category } from "../../interfaces/demoblaze-interface";
import { readJson } from "../../utils/readJson";
import { test, expect } from "../base-test";

const products = readJson<Product[]>("demoblaze/products.json");
const user = readJson<User>("demoblaze/users.json");
test.beforeEach(async ({ loginPage, homePage, productPage, cartPage}) => {
    // Navigate to DemoBlaze home page
    await productPage.navigateToHomePage();
    // Login before each test
    await loginPage.login(user.username, user.password);
    await homePage.verifyWelcomeMessage(user.username);
    await homePage.goToCart();
    await cartPage.clearCart();
    await homePage.clickHome();
  });
// TC2 - Cart - Add Multiple Items
test("TC2 - Cart - add multiple items - items appear and total sums correctly", async ({ homePage, productPage, cartPage }) => {

  // Add first product (Phones -> Samsung galaxy s6)
  await homePage.selectCategory(Category.Phones);
  const samsungPhone = products[0];
  await homePage.selectProduct(samsungPhone.name);
  const samsungPrice = await productPage.getProductPrice();
  await productPage.addToCart();

  // Go home and add second product (Laptops -> MacBook Pro)
  await homePage.clickHome();
  await homePage.selectCategory(Category.Laptops);
  const macbookLaptop = products[1];
  await homePage.selectProduct(macbookLaptop.name);
  const macbookPrice = await productPage.getProductPrice();
  await productPage.addToCart();

  // Go to cart and verify
  await homePage.goToCart();
  await cartPage.verifyCartItemCount(2);
  await cartPage.verifyCartContainsProductByPrice(samsungPhone.name, samsungPrice);
  await cartPage.verifyCartContainsProductByPrice(macbookLaptop.name, macbookPrice);
  const expectedTotal = samsungPrice + macbookPrice;
  await cartPage.verifyTotal(expectedTotal);
});
