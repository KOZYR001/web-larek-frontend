import { EventEmitter } from './EventEmitter';
import { ProductModel } from './ProductModel';
import { CartModel } from './CartModel';
import { OrderModel } from './OrderModel';
import { ApiService } from './ApiService';

export class AppState {
  products: ProductModel;
  cart: CartModel;
  order: OrderModel;

  constructor(eventEmitter: EventEmitter) {
    this.products = new ProductModel(eventEmitter, new ApiService()); // Убрали аргумент
    this.cart = new CartModel(eventEmitter);
    this.order = new OrderModel(eventEmitter, new ApiService()); // Убрали аргумент
  }
}