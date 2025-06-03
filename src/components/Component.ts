import { IComponent } from '../types';

export class Component implements IComponent {
  protected _element: HTMLElement;

  constructor(element: HTMLElement) {
    this._element = element;
  }

  get element(): HTMLElement {
    return this._element;
  }

  render(): HTMLElement;
  render<T>(data: T): HTMLElement;
  // Единая реализация
  render<T>(data?: T): HTMLElement {
    return this._element;
  }
}