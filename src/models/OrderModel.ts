import { EventEmitter } from './EventEmitter';
import { IOrder, IOrderResult, ICartItem } from '../types';
import { ApiService } from './ApiService';

export class OrderModel {
  order: Omit<IOrder, 'items' | 'total'> = {
    address: '',
    email: '',
    phone: '',
    payment: 'card',
  };

  eventEmitter: EventEmitter;
  api: ApiService;

  constructor(eventEmitter: EventEmitter, api: ApiService) {
    this.eventEmitter = eventEmitter;
    this.api = api;
  }

  setOrderField(field: keyof Omit<IOrder, 'items' | 'total'>, value: string): void {
    (this.order[field] as string) = value;
    this.eventEmitter.emit('order:updated', { field, value });
  }

  validateField(field: keyof Omit<IOrder, 'items' | 'total'>): boolean {
    if (field === 'payment') return ['card', 'cash'].includes(this.order.payment);
    return !!this.order[field]?.trim();
  }

  getErrors(): { field: string; message: string }[] {
    const errors: { field: string; message: string }[] = [];
    if (!this.validateField('address')) errors.push({ field: 'address', message: 'Введите адрес доставки' });
    if (!this.validateField('email')) errors.push({ field: 'email', message: 'Введите email' });
    if (!this.validateField('phone')) errors.push({ field: 'phone', message: 'Введите телефон' });
    if (!this.validateField('payment')) errors.push({ field: 'payment', message: 'Выберите способ оплаты' });
    return errors;
  }

  createOrderToPost(items: string[], total: number): IOrder {
    return {
      ...this.order,
      items,
      total,
    };
  }
}