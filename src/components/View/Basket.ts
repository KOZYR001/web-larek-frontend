
import { createElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { IProductItem } from "../../types";
import { BasketItem } from "./BasketItem";

export interface IBasket {
  basket: HTMLElement;
  title: HTMLElement;
  basketList: HTMLElement;
  button: HTMLButtonElement;
  basketPrice: HTMLElement;
  renderSumAllProducts(sumAll: number): void;
  render(): HTMLElement;
  renderBasketItems(items: IProductItem[]): void;
}

export class Basket implements IBasket {
  basket: HTMLElement;
  title: HTMLElement;
  basketList: HTMLElement;
  button: HTMLButtonElement;
  basketPrice: HTMLElement;

  constructor(template: HTMLTemplateElement, protected events: IEvents, protected cardBasketTemplate: HTMLTemplateElement) {
    this.basket = template.content.querySelector('.basket').cloneNode(true) as HTMLElement;
    this.title = this.basket.querySelector('.modal__title');
    this.basketList = this.basket.querySelector('.basket__list');
    this.button = this.basket.querySelector('.basket__button');
    this.basketPrice = this.basket.querySelector('.basket__price');

    this.button.addEventListener('click', () => { this.events.emit('order:open') });
    this.items = [];
  }

  set items(items: HTMLElement[]) {
    if (items.length) {
      this.basketList.replaceChildren(...items);
      this.button.removeAttribute('disabled');
    } else {
      this.button.setAttribute('disabled', 'disabled');
      this.basketList.replaceChildren(createElement<HTMLParagraphElement>('p', { textContent: 'Корзина пуста' }));
    }
  }

  renderSumAllProducts(sumAll: number) {
    this.basketPrice.textContent = String(sumAll + ' синапсов');
  }

  renderBasketItems(items: IProductItem[]): void {
    let i = 0;
    const basketItems = items.map((item) => {
      const basketItem = new BasketItem(this.cardBasketTemplate, this.events, {
        onClick: () => this.events.emit('basket:basketItemRemove', item)
      });
      i = i + 1;
      return basketItem.render(item, i);
    });
    this.items = basketItems;
  }

  render() {
    this.title.textContent = 'Корзина';
    return this.basket;
  }
}
