import { Component } from './Component';
import { IComponent } from '../types';

interface ICartIcon extends IComponent {
  render(count?: number): HTMLElement;
}

export class CartIcon extends Component implements ICartIcon {
  private counter: HTMLElement;

  constructor(element: HTMLElement) {
    super(element);
    this.counter = this._element.querySelector('.header__basket-counter') as HTMLElement;

    if (!this.counter) {
      throw new Error('Элемент .header__basket-counter не найден в шаблоне CartIcon');
    }

    this._element.addEventListener('click', () => {
      const event = new CustomEvent('openCart');
      this._element.dispatchEvent(event);
    });
  }

  render(count?: number): HTMLElement {
    this.counter.textContent = count.toString();
    return this._element;
  }
}