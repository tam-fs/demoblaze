import { Product, User, Category } from "../../interfaces/demoblaze-interface";
import { readJson } from "../../utils/readJson";
import { test, expect } from "../base-test";

const user = readJson<User>("demoblaze/users.json");
const products = readJson<Product[]>("demoblaze/products.json");
test.beforeEach(async ({ loginPage, homePage, productPage, cartPage }) => {
    await productPage.navigateToHomePage();
    await loginPage.login(user.username, user.password);
    await homePage.verifyWelcomeMessage(user.username);
    await homePage.goToCart();
    await cartPage.clearCart();
    await homePage.clickHome();
  });
// TC4 - Cart - Remove Item
test("TC4 - Cart - remove item - remaining items and total updated", async ({ homePage, productPage, cartPage }) => {

  // Add Sony xperia z5
  await homePage.selectCategory(Category.Phones);
  const sonyPhone = products[2];
  await homePage.selectProduct(sonyPhone.name);
  const sonyPrice = await productPage.getProductPrice();
  await productPage.addToCart();

  // Add MacBook air
  await homePage.clickHome();
  await homePage.selectCategory(Category.Laptops);
  const macbookLaptop = products[3];
  await homePage.selectProduct(macbookLaptop.name);
  const macbookPrice = await productPage.getProductPrice();
  await productPage.addToCart();

  await homePage.goToCart();
  await cartPage.verifyCartItemCount(2);
  await cartPage.removeItem(sonyPhone.name);
  await cartPage.verifyCartItemCount(1);
  await cartPage.verifyCartContainsProduct(macbookLaptop.name);
  await cartPage.verifyTotal(macbookPrice);
});
