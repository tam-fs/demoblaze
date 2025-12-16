import { read } from "fs";
import { test, expect } from "../base-test";
import { readJson } from "../../utils/readJson";
import { User } from "../../interfaces/demoblaze-interface";

// TC1 - Login - Valid Login
test("TC1 - Login - valid credentials - shows welcome and logout button", async ({ loginPage, homePage }) => {
  const user = readJson<User>("demoblaze/users.json");
  await homePage.navigateToHomePage();
  await loginPage.login(user.username, user.password);

  await homePage.verifyWelcomeMessage(user.username);
  await homePage.verifyLogoutButtonVisible();
  await homePage.verifyLoginButtonHidden();
});
