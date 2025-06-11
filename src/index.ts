
import './scss/styles.scss';

import { CDN_URL, API_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { ApiModel } from './components/Model/ApiModel';
import { DataModel } from './components/Model/DataModel';
import { Card } from './components/View/Card';
import { CardPreview } from './components/View/CardPreview';
import { IOrderForm, IProductItem } from './types';
import { Modal } from './components/View/Modal';
import { ensureElement } from './utils/utils';
import { BasketModel } from './components/Model/BasketModel';
import { Basket } from './components/View/Basket';
import { BasketItem } from './components/View/BasketItem';
import { FormModel } from './components/Model/FormModel';
import { Order } from './components/View/FormOrder';
import { Contacts } from './components/View/FormContacts';
import { Success } from './components/View/Success';
import { HeaderView } from './components/View/HeaderView';
import { MainPage } from './components/View/MainPage';

const cardCatalogTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const cardPreviewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const cardBasketTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
const contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
const successTemplate = document.querySelector('#success') as HTMLTemplateElement;

const apiModel = new ApiModel(CDN_URL, API_URL);
const events = new EventEmitter();
const dataModel = new DataModel(events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(basketTemplate, events, cardBasketTemplate); // Передача cardBasketTemplate
const basketModel = new BasketModel();
const formModel = new FormModel(events);
const order = new Order(orderTemplate, events);
const contacts = new Contacts(contactsTemplate, events);
const headerView = new HeaderView(events);
const mainPage = new MainPage(cardCatalogTemplate, events);

/********** Отображение карточек товара на странице **********/
events.on('productCards:receive', () => {
  mainPage.render(dataModel.productCards);
});

/********** Получить объект данных "IProductItem" карточки по которой кликнули **********/
events.on('card:select', (item: IProductItem) => { dataModel.setPreview(item) });

/********** Открываем модальное окно карточки товара **********/
events.on('modalCard:open', (item: IProductItem) => {
  const cardPreview = new CardPreview(cardPreviewTemplate, events);
  modal.content = cardPreview.render(item, basketModel.basketProducts);
  modal.render();
});

/********** Добавление карточки товара в корзину **********/
events.on('card:addBasket', () => {
  basketModel.setSelectedСard(dataModel.selectedСard);
  headerView.renderBasketCounter(basketModel.getCounter());
  modal.close();
});

/********** Открытие модального окна корзины **********/
events.on('basket:open', () => {
  basket.renderSumAllProducts(basketModel.getSumAllProducts());
  basket.renderBasketItems(basketModel.basketProducts);
  modal.content = basket.render();
  modal.render();
});

/********** Удаление карточки товара из корзины **********/
events.on('basket:basketItemRemove', (item: IProductItem) => {
  basketModel.deleteCardToBasket(item);
  headerView.renderBasketCounter(basketModel.getCounter());
  basket.renderSumAllProducts(basketModel.getSumAllProducts());
  basket.renderBasketItems(basketModel.basketProducts);
});

/********** Открытие модального окна "способа оплаты" и "адреса доставки" **********/
events.on('order:open', () => {
  modal.content = order.render();
  modal.render();
});

events.on('order:paymentSelection', (button: HTMLButtonElement) => {
  formModel.payment = button.name;
  formModel.validateOrder();
});

events.on('order:changeAddress', (data: { field: string, value: string }) => {
  formModel.setOrderAddress(data.field, data.value);
});

/********** Валидация данных строки "address" и payment **********/
events.on('formErrors:address', (errors: Partial<IOrderForm>) => {
  const { address, payment } = errors;
  order.valid = !address && !payment;
  order.formErrors.textContent = Object.values({address, payment}).filter(i => !!i).join('; ');
});

/********** Открытие модального окна "Email" и "Телефон" **********/
events.on('contacts:open', () => {
  modal.content = contacts.render();
  modal.render();
});

/********** Отслеживаем изменение в полях вода "Email" и "Телефон" **********/
events.on('contacts:changeInput', (data: { field: string, value: string }) => {
  formModel.setOrderData(data.field, data.value);
});

/********** Валидация данных строки "Email" и "Телефон" **********/
events.on('formErrors:change', (errors: Partial<IOrderForm>) => {
  const { email, phone } = errors;
  contacts.valid = !email && !phone;
  contacts.formErrors.textContent = Object.values({phone, email}).filter(i => !!i).join('; ');
});

/********** Открытие модального окна "Заказ оформлен" **********/
events.on('success:open', () => {
  apiModel.postOrderLot(formModel.getOrderLot(
    basketModel.basketProducts.map(item => item.id),
    basketModel.getSumAllProducts()
  ))
    .then((data) => {
      console.log(data);
      const success = new Success(successTemplate, events);
      modal.content = success.render(basketModel.getSumAllProducts());
      basketModel.clearBasketProducts();
      headerView.renderBasketCounter(basketModel.getCounter());
      modal.render();
    })
    .catch(error => console.log(error));
});

events.on('success:close', () => modal.close());

/********** Блокируем прокрутку страницы при открытие модального окна **********/
events.on('modal:open', () => {
  modal.locked = true;
});

/********** Разблокируем прокрутку страницы при закрытие модального окна **********/
events.on('modal:close', () => {
  modal.locked = false;
});

/********** Получаем данные с сервера **********/
apiModel.getListProductCard()
  .then(function (data: IProductItem[]) {
    dataModel.productCards = data;
  })
  .catch(error => console.log(error));
