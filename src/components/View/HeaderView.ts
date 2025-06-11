

import { IEvents } from "../base/events";

export interface IHeaderView {
  renderBasketCounter(value: number): void;
}

export class HeaderView implements IHeaderView {
  protected headerBasketButton: HTMLButtonElement;
  protected headerBasketCounter: HTMLElement;

  constructor(protected events: IEvents) {
    
    this.headerBasketButton = document.querySelector('.header__basket')!;
    this.headerBasketCounter = document.querySelector('.header__basket-counter')!;

    this.headerBasketButton.addEventListener('click', () => {
      this.events.emit('basket:open');
    });
  }

  renderBasketCounter(value: number) {
    this.headerBasketCounter.textContent = String(value);
  }
}

