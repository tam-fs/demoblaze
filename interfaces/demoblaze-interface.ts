export interface CheckoutData {
  name: string;
  country: string;
  city: string;
  creditCard: string;
  month: string;
  year: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
}

export interface User {
  username: string;
  password: string;
}

export enum Category {
  Phones = "Phones",
  Laptops = "Laptops",
  Monitors = "Monitors"
}
