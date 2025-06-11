
import { IEvents } from "../base/events";
import { IProductItem } from "../../types";
import { Card } from "./Card";
import { ensureElement } from "../../utils/utils";

export interface IMainPage {
  render(items: IProductItem[]): HTMLElement;
}

export class MainPage implements IMainPage {
  protected galleryContainer: HTMLElement;

  constructor(protected template: HTMLTemplateElement, protected events: IEvents) {
    this.galleryContainer = ensureElement<HTMLElement>('.gallery');
  }

  render(items: IProductItem[]): HTMLElement {
    this.galleryContainer.innerHTML = ''; // Очистка содержимого
    items.forEach(item => {
      const card = new Card(this.template, this.events, { onClick: () => this.events.emit('card:select', item) });
      this.galleryContainer.append(card.render(item));
    });
    return this.galleryContainer;
  }
}
