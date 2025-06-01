// src/components/App.ts
import { ProductList } from './ProductList';
import { ProductCard } from './ProductCard';
import { CartView } from './CartView';
import { CartIcon } from './CartIcon';
import { SuccessView } from './SuccessView';
import { OrderModel } from '../models/OrderModel';
import { EventEmitter } from '../models/EventEmitter';
import { IProduct, ICart, ICartItem, IOrder, IOrderResult } from '../types';

interface AppConfig {
  productList: ProductList;
  productCard: typeof ProductCard;
  cartView: CartView;
  cartIcon: CartIcon;
  successView: SuccessView;
  orderModel: OrderModel;
  eventEmitter: EventEmitter;
}

export class App {
  private productList: ProductList;
  private productCard: typeof ProductCard;
  private cartView: CartView;
  private cartIcon: CartIcon;
  private successView: SuccessView;
  private orderModel: OrderModel;
  private eventEmitter: EventEmitter;
  private cart: ICart = { items: [], total: 0 };

  constructor(config: AppConfig) {
    this.productList = config.productList;
    this.productCard = config.productCard;
    this.cartView = config.cartView;
    this.cartIcon = config.cartIcon;
    this.successView = config.successView;
    this.orderModel = config.orderModel;
    this.eventEmitter = config.eventEmitter;

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    // Здесь логика обработки событий, как в предыдущем ответе
    this.eventEmitter.on('openCart', () => {
      const modal = document.getElementById('modal-container') as HTMLElement | null;
      if (modal) {
        modal.classList.add('modal_active');
        this.cartView.render(this.cart);
      }
    });

    // Добавь остальные обработчики событий из предыдущего ответа
  }

  public start(): void {
  this.orderModel.api.getProducts()
    .then((products) => {
      if (products) this.productList.render(products);
      this.cartIcon.render(this.cart.items.length);
    })
    .catch((err) => console.error('Ошибка загрузки продуктов:', err));
}
}