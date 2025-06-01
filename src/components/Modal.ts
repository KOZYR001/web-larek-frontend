import { Component } from './Component';
import { IComponent } from '../types';

interface IModal extends IComponent {
  open(content: HTMLElement): void;
  close(): void;
}

export class Modal extends Component implements IModal {
  private content: HTMLElement;
  private closeButton: HTMLButtonElement;

  constructor(element: HTMLElement) {
    super(element);
    this.content = this._element.querySelector('.modal__content') as HTMLElement;
    this.closeButton = this._element.querySelector('.modal__close') as HTMLButtonElement;

    this.closeButton.addEventListener('click', () => this.close());
    this._element.addEventListener('click', (e) => {
      if (e.target === this._element) this.close();
    });
  }

  open(content: HTMLElement): void {
    this.content.innerHTML = '';
    this.content.appendChild(content);
    this._element.classList.add('modal_active');
  }

  close(): void {
    this._element.classList.remove('modal_active');
    const event = new CustomEvent('modal:close');
    this._element.dispatchEvent(event);
  }
}