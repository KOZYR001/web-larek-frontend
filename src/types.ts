export interface IProduct {
  id: string;
  title: string;
  price: number | null;
  image: string;
  description: string;
  category: string;
}

export interface ICartItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
}

export interface ICart {
  items: ICartItem[];
  total: number;
}

export interface IOrder {
  address: string;
  email: string;
  phone: string;
  payment: 'card' | 'cash';
  items: string[];
  total: number;
}

export interface IOrderResult {
  orderId: string;
  total: number;
}

export interface IApiService {
  get(endpoint: string): Promise<any>;
  post(endpoint: string, data: object): Promise<any>;
  getProducts(): Promise<IProduct[]>;
}


export interface IComponent {
  element: HTMLElement;
  render(): HTMLElement; // Базовая реализация без аргументов
  render<T>(data: T): HTMLElement; // Перегрузка с аргументом
}