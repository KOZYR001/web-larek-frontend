import { Component } from './Component';
import { ProductCard } from './ProductCard';
import { IProduct, IComponent } from '../types';

interface IProductList extends IComponent {
  render(products: IProduct[]): HTMLElement;
}

export class ProductList extends Component implements IProductList {
  private container: HTMLElement;

  constructor(element: HTMLElement) {
    super(element);
    this.container = this._element;

    if (!this.container) {
      throw new Error('Контейнер для ProductList не найден');
    }
  }

  render(products: IProduct[]): HTMLElement {
    this.container.innerHTML = '';
    products.forEach(product => {
      const cardTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
      if (!cardTemplate) throw new Error('Шаблон #card-catalog не найден');
      const cardElement = cardTemplate.content.cloneNode(true).firstElementChild as HTMLElement;
      const productCard = new ProductCard(cardElement, 'catalog');
      this.container.appendChild(productCard.render(product));
    });
    return this._element;
  }
}