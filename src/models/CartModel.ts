import { EventEmitter } from './EventEmitter';
import { ICart, ICartItem, IProduct } from '../types';

export class CartModel {
  cart: ICart = { items: [], total: 0 };
  eventEmitter: EventEmitter;

  constructor(eventEmitter: EventEmitter) {
    this.eventEmitter = eventEmitter;
  }

  addItem(product: IProduct): void {
    const existingItem = this.cart.items.find(item => item.productId === product.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.cart.items.push({
        productId: product.id,
        title: product.title,
        price: product.price,
        quantity: 1,
      });
    }
    this.updateTotal();
    this.eventEmitter.emit('cart:changed', this.cart);
  }

  removeItem(productId: string): void {
    this.cart.items = this.cart.items.filter(item => item.productId !== productId);
    this.updateTotal();
    this.eventEmitter.emit('cart:changed', this.cart);
  }

  updateQuantity(productId: string, quantity: number): void {
    const item = this.cart.items.find(item => item.productId === productId);
    if (item) {
      item.quantity = quantity;
      if (item.quantity <= 0) {
        this.removeItem(productId);
      } else {
        this.updateTotal();
        this.eventEmitter.emit('cart:changed', this.cart);
      }
    }
  }

  getTotal(): number {
    return this.cart.total;
  }

  clear(): void {
    this.cart.items = [];
    this.cart.total = 0;
    this.eventEmitter.emit('cart:changed', this.cart);
  }

  private updateTotal(): void {
    this.cart.total = this.cart.items.reduce((sum, item) => sum + (item.price ?? 0) * item.quantity, 0);
  }
}