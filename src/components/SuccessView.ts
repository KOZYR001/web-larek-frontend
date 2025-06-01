import { Component } from './Component';
import { IOrderResult, IComponent } from '../types';

interface ISuccessView extends IComponent {
  render(result: IOrderResult, total: number): HTMLElement;
}

export class SuccessView extends Component implements ISuccessView {
  private modalContent: HTMLElement;
  private title: HTMLElement;
  private description: HTMLElement;
  private button: HTMLButtonElement;

  constructor(element: HTMLElement) {
    super(element);
    this.modalContent = this._element.querySelector('.modal__content') as HTMLElement;
    if (!this.modalContent) throw new Error('Элемент .modal__content не найден в #modal-container');

    const successTemplate = document.querySelector('#success') as HTMLTemplateElement;
    if (!successTemplate) throw new Error('Шаблон #success не найден');
    const successElement = successTemplate.content.cloneNode(true).firstElementChild as HTMLElement;
    this.modalContent.appendChild(successElement);

    this.title = this.modalContent.querySelector('.order-success__title') as HTMLElement;
    this.description = this.modalContent.querySelector('.order-success__description') as HTMLElement;
    this.button = this.modalContent.querySelector('.order-success__close') as HTMLButtonElement;

    if (!this.title || !this.description || !this.button) {
      throw new Error('Не все элементы найдены в шаблоне #success. Проверьте классы .order-success__title, .order-success__description, .order-success__close.');
    }

    this.button.addEventListener('click', () => {
      const event = new CustomEvent('order:success');
      this._element.dispatchEvent(event);
    });
  }

  render(result: IOrderResult, total: number): HTMLElement {
    this.description.textContent = `Списано ${total} синапсов`;
    return this._element;
  }
}