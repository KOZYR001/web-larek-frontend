import { App } from './components/App';
import { ProductCard } from './components/ProductCard';
import { ProductList } from './components/ProductList';
import { CartView } from './components/CartView';
import { CartIcon } from './components/CartIcon';
import { SuccessView } from './components/SuccessView';
import { EventEmitter } from './models/EventEmitter';
import { OrderModel } from './models/OrderModel';
import { ApiService } from './models/ApiService';

const eventEmitter = new EventEmitter();
const api = new ApiService();
const orderModel = new OrderModel(eventEmitter, api);

const app = new App({
  productList: new ProductList(document.querySelector('.gallery') as HTMLElement),
  productCard: ProductCard,
  cartView: new CartView(document.getElementById('modal-container') as HTMLElement),
  cartIcon: new CartIcon(document.querySelector('.header__basket') as HTMLElement),
  successView: new SuccessView(document.getElementById('modal-container') as HTMLElement),
  orderModel: orderModel,
  eventEmitter: eventEmitter,
});

app.start();