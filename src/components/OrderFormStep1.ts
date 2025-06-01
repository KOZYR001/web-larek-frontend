import { Component } from './Component';
import { IComponent } from '../types';

interface IOrderFormStep1 extends IComponent {
  setField(name: string, value: string): void;
  setError(field: string, message: string): void;
}

export class OrderFormStep1 extends Component implements IOrderFormStep1 {
  private paymentButtons: HTMLButtonElement[];
  private address: HTMLInputElement;
  private submitButton: HTMLButtonElement;
  private error: HTMLElement;

  constructor(element: HTMLFormElement) {
    super(element);
    this.paymentButtons = Array.from(this._element.querySelectorAll('.order__button')) as HTMLButtonElement[];
    this.address = this._element.querySelector('input[name="address"]') as HTMLInputElement;
    this.submitButton = this._element.querySelector('.order__submit') as HTMLButtonElement;
    this.error = this._element.querySelector('.form__errors') as HTMLElement;

    this.paymentButtons.forEach(button => {
      button.addEventListener('click', () => {
        this.paymentButtons.forEach(btn => btn.classList.remove('button_alt-active'));
        button.classList.add('button_alt-active');
        const value = button.classList.contains('button_alt') ? 'card' : 'cash';
        const event = new CustomEvent('form:change', { detail: { field: 'payment', value } });
        this._element.dispatchEvent(event);
      });
    });

    this.address.addEventListener('input', () => {
      const event = new CustomEvent('form:change', { detail: { field: 'address', value: this.address.value } });
      this._element.dispatchEvent(event);
    });

    this._element.addEventListener('submit', (e) => {
      e.preventDefault();
      const event = new CustomEvent('form:submit');
      this._element.dispatchEvent(event);
    });
  }

  setField(name: string, value: string): void {
    if (name === 'payment') {
      this.paymentButtons.forEach(button => {
        button.classList.remove('button_alt-active');
        if ((value === 'card' && button.classList.contains('button_alt')) ||
            (value === 'cash' && !button.classList.contains('button_alt'))) {
          button.classList.add('button_alt-active');
        }
      });
    } else if (name === 'address') {
      this.address.value = value;
    }
    this.updateButtonState();
  }

  setError(field: string, message: string): void {
    this.error.textContent = message;
  }

  private updateButtonState(): void {
    const isPaymentSelected = this.paymentButtons.some(button => button.classList.contains('button_alt-active'));
    this.submitButton.disabled = !isPaymentSelected || !this.address.value.trim();
  }
}