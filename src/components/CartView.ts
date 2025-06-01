import { Component } from './Component';
import { ICart, IComponent } from '../types';

interface ICartView extends IComponent {
  render(cart: ICart): HTMLElement;
}

export class CartView extends Component implements ICartView {
  private modalContent: HTMLElement;
  private items: HTMLElement;
  private total: HTMLElement;
  private button: HTMLButtonElement;

  constructor(element: HTMLElement) {
    super(element);
    this.modalContent = this._element.querySelector('.modal__content') as HTMLElement;
    if (!this.modalContent) throw new Error('Элемент .modal__content не найден в #modal-container');

    const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
    if (!basketTemplate) throw new Error('Шаблон #basket не найден');
    const basketElement = basketTemplate.content.cloneNode(true).firstElementChild as HTMLElement;
    this.modalContent.appendChild(basketElement);

    this.items = this.modalContent.querySelector('.basket__list') as HTMLElement;
    this.total = this.modalContent.querySelector('.basket__price') as HTMLElement;
    this.button = this.modalContent.querySelector('.basket__button') as HTMLButtonElement;

    if (!this.items || !this.total || !this.button) {
      throw new Error('Не все элементы найдены в шаблоне #basket. Проверьте классы .basket__list, .basket__price, .basket__button.');
    }

    this.button.addEventListener('click', () => {
      const event = new CustomEvent('openOrderForm');
      this._element.dispatchEvent(event);
    });
  }

  render(cart: ICart): HTMLElement {
    this.items.innerHTML = '';
    cart.items.forEach((item, index) => {
      const cardTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
      if (!cardTemplate) throw new Error('Шаблон #card-basket не найден');
      const cardElement = cardTemplate.content.cloneNode(true).firstElementChild as HTMLElement;
      cardElement.querySelector('.basket__item-index')!.textContent = (index + 1).toString();
      cardElement.querySelector('.card__title')!.textContent = item.title;
      cardElement.querySelector('.card__price')!.textContent = `${item.price} синапсов`;
      const deleteButton = cardElement.querySelector('.basket__item-delete') as HTMLButtonElement;
      deleteButton.addEventListener('click', () => {
        const event = new CustomEvent('removeFromCart', { detail: item.productId });
        this._element.dispatchEvent(event);
      });
      this.items.appendChild(cardElement);
    });
    this.total.textContent = `${cart.total} синапсов`;
    this.button.disabled = cart.items.length === 0;
    return this._element;
  }
}