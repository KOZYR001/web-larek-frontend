import { Component } from './Component';
import { IProduct, ICartItem, IComponent } from '../types';

interface IProductCard extends IComponent {
  render(data: IProduct): HTMLElement;
}

export class ProductCard extends Component implements IProductCard {
  private title: HTMLElement;
  private price: HTMLElement;
  private image: HTMLImageElement;
  private description: HTMLElement | null;
  private category: HTMLElement | null;
  private button: HTMLButtonElement | null;
  private context: 'catalog' | 'cart' | 'modal';

  constructor(element: HTMLElement, context: 'catalog' | 'cart' | 'modal') {
    super(element);
    this.context = context;

    this.title = this._element.querySelector('.card__title') as HTMLElement;
    this.price = this._element.querySelector('.card__price') as HTMLElement;
    this.image = this._element.querySelector('.card__image') as HTMLImageElement;
    this.description = this._element.querySelector('.card__text') || null;
    this.category = this._element.querySelector('.card__category') || null;
    this.button = this._element.querySelector('.card__button') || null;

    if (!this.title || !this.price || !this.image) {
      throw new Error('Не все обязательные элементы найдены в шаблоне ProductCard. Проверьте классы .card__title, .card__price, .card__image.');
    }

    if (this.context === 'catalog') {
      this._element.addEventListener('click', () => this.emit('card:select', (this._element as any).dataset.id));
    } else if (this.context === 'modal' && this.button) {
      this.button.addEventListener('click', (e) => {
        e.stopPropagation();
        const isInCart = this.isInCart((this._element as any).dataset.id);
        this.emit(isInCart ? 'removeFromCart' : 'addToCart', (this._element as any).dataset.id);
      });
    }
  }

  render(data: IProduct): HTMLElement {
    (this._element as any).dataset.id = data.id;
    (this._element as any).dataset.inCart = this.context === 'modal' ? this.isInCart(data.id) : 'false';
    this.title.textContent = data.title;
    this.price.textContent = data.price !== null ? `${data.price} синапсов` : 'Бесплатно';
    this.image.src = data.image || '';
    if (this.description && data.description) this.description.textContent = data.description;
    if (this.category && data.category) this.category.textContent = data.category;
    if (this.context === 'modal' && this.button) {
      this.button.textContent = this.isInCart(data.id) ? 'Удалить' : 'В корзину';
    }
    return this._element;
  }

  private emit(event: string, data: any): void {
    const customEvent = new CustomEvent(event, { detail: data });
    this._element.dispatchEvent(customEvent);
  }

  private isInCart(productId: string): boolean {
    const cart = (window as any).eventEmitter?.get('cart') as { items: ICartItem[] };
    return cart?.items.some(item => item.productId === productId) || false;
  }
}