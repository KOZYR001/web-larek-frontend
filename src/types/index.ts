export interface IProduct {
    id: string;
    title: string;
    price: number;
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
    items: string[];
    address: string;
    email: string;
    phone: string;
    payment: 'card' | 'cash';
  }
  
  export interface IOrderResult {
    orderId: string;
    success: boolean;
  }