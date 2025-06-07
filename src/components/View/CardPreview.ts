import { Card } from "./Card";
import { IActions, IProductItem } from "../../types";
import { IEvents } from "../base/events";

export interface ICard {
  text: HTMLElement;
  button: HTMLElement;
  render(data: IProductItem): HTMLElement;
}

export class CardPreview extends Card implements ICard {
  text: HTMLElement;
  button: HTMLElement;

  constructor(template: HTMLTemplateElement, protected events: IEvents, actions?: IActions) {
    super(template, events, actions);
    this.text = this._cardElement.querySelector('.card__text');
    this.button = this._cardElement.querySelector('.card__button');
    this.button.addEventListener('click', () => { this.events.emit('card:addBasket') });
  }

  notSale(data:IProductItem) {
    if(data.price) {
      return 'Купить'
    } else {
      this.button.setAttribute('disabled', 'true')
      return 'Не продается'
    }
  }

  render(data: IProductItem, basketItems: IProductItem[] = []): HTMLElement {
    this._cardCategory.textContent = data.category;
    this.cardCategory = data.category;
    this._cardTitle.textContent = data.title;
    this._cardImage.src = data.image;
    this._cardImage.alt = this._cardTitle.textContent;
    this._cardPrice.textContent = this.setPrice(data.price);
    this.text.textContent = data.description;

    const inBasket = basketItems.some(item => item.id === data.id);

    if (!data.price) {
      this.button.textContent = 'Не продается';
      this.button.setAttribute('disabled', 'true');
    } else if (inBasket) {
      this.button.textContent = 'Уже в корзине';
      this.button.setAttribute('disabled', 'true');
    } else {
      this.button.textContent = 'Купить';
      this.button.removeAttribute('disabled');
    }

    return this._cardElement;
  }
}