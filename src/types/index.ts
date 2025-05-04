interface IProduct {
  id: string;
  title: string;
  price: number;
  image: string;
  description: string;
  category: string;
}

interface ICartItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
}

interface ICart {
  items: ICartItem[];
  total: number;
}

interface IOrder {
  address: string;
  email: string;
  phone: string;
  payment: 'card' | 'cash';
}

interface IOrderResult {
  orderId: string;
  success: boolean;
}

interface IApiService {
  get<T>(endpoint: string): Promise<T>;
  post<T>(endpoint: string, data: object): Promise<T>;
}

enum Events {
  PRODUCTS_CHANGED = 'products:changed',
  PRODUCT_SELECTED = 'product:selected',
  CART_CHANGED = 'cart:changed',
  ORDER_UPDATED = 'order:updated',
  ORDER_SUBMIT = 'order:submit',
  ORDER_SUBMITTED = 'order:submitted',
  CARD_SELECT = 'card:select',
  ADD_TO_CART = 'addToCart',
  REMOVE_FROM_CART = 'removeFromCart',
  OPEN_CART = 'openCart',
  OPEN_ORDER_FORM = 'openOrderForm',
  FORM_CHANGE = 'form:change',
  FORM_SUBMIT = 'form:submit',
  MODAL_CLOSE = 'modal:close',
  ORDER_SUCCESS = 'order:success',
}

export {
  IProduct,
  ICartItem,
  ICart,
  IOrder,
  IOrderResult,
  IApiService,
  Events,
};