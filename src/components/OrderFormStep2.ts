import { Component } from './Component';
import { IComponent } from '../types';

interface IOrderFormStep2 extends IComponent {
  setField(name: string, value: string): void;
  setError(field: string, message: string): void;
}

export class OrderFormStep2 extends Component implements IOrderFormStep2 {
  private email: HTMLInputElement;
  private phone: HTMLInputElement;
  private submitButton: HTMLButtonElement;
  private error: HTMLElement;

  constructor(element: HTMLFormElement) {
    super(element);
    this.email = this._element.querySelector('input[name="email"]') as HTMLInputElement;
    this.phone = this._element.querySelector('input[name="phone"]') as HTMLInputElement;
    this.submitButton = this._element.querySelector('.contacts__submit') as HTMLButtonElement;
    this.error = this._element.querySelector('.form__errors') as HTMLElement;

    this.email.addEventListener('input', () => {
      const event = new CustomEvent('form:change', { detail: { field: 'email', value: this.email.value } });
      this._element.dispatchEvent(event);
    });

    this.phone.addEventListener('input', () => {
      const event = new CustomEvent('form:change', { detail: { field: 'phone', value: this.phone.value } });
      this._element.dispatchEvent(event);
    });

    this._element.addEventListener('submit', (e) => {
      e.preventDefault();
      const event = new CustomEvent('form:submit');
      this._element.dispatchEvent(event);
    });
  }

  setField(name: string, value: string): void {
    if (name === 'email') this.email.value = value;
    if (name === 'phone') this.phone.value = value;
    this.updateButtonState();
  }

  setError(field: string, message: string): void {
    this.error.textContent = message;
  }

  private updateButtonState(): void {
    this.submitButton.disabled = !this.email.value.trim() || !this.phone.value.trim();
  }
}