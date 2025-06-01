import { EventEmitter } from './EventEmitter';
import { IProduct } from '../types';
import { ApiService } from './ApiService';

export class ProductModel {
  products: IProduct[] = [];
  selectedProduct: IProduct | null = null;
  eventEmitter: EventEmitter;
  api: ApiService;

  constructor(eventEmitter: EventEmitter, api: ApiService) {
    this.eventEmitter = eventEmitter;
    this.api = api;
  }

  async fetchProducts(): Promise<void> {
    try {
      const data = await this.api.get('/products');
      this.products = data;
      this.eventEmitter.emit('products:changed', this.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }

  setSelectedProduct(product: IProduct | null): void {
    this.selectedProduct = product;
    this.eventEmitter.emit('product:selected', this.selectedProduct);
  }

  filterProducts(category?: string, maxPrice?: number): IProduct[] {
    return this.products.filter(product => {
      const matchesCategory = !category || product.category === category;
      const matchesPrice = !maxPrice || (product.price ?? Infinity) <= maxPrice;
      return matchesCategory && matchesPrice;
    });
  }
}