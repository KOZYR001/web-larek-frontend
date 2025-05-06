Проект: Веб-ларёк
Интернет-магазин с каталогом товаров, корзиной и оформлением заказа.
Используемый стек

Язык: TypeScript
Сборка: Webpack
API: REST API (https://larek-api.nomoreparties.co)
Инструменты: Postman (тестирование API), Draw.IO (UML-схемы)

Инструкция по сборке и запуску

Клонируйте репозиторий: git clone [ссылка]
Установите зависимости: npm install
Создайте файл .env в корне проекта:API_ORIGIN=https://larek-api.nomoreparties.co


Запустите проект: npm run dev
Импортируйте коллекцию Postman: weblarek.postman.json

Архитектурный подход
Приложение использует парадигму MVP (Model-View-Presenter) с событийно-ориентированным подходом. Слои:

Слой модели: Хранит и обрабатывает данные (товары, корзина, заказ).
Слой представления: Отображает данные в UI (карточки товаров, корзина, модальные окна).
Слой презентера: Координирует взаимодействие через события. Код презентера размещён в основном скрипте (index.ts).

События обрабатываются через класс EventEmitter.
Описание данных
Интерфейсы

IProduct
Описание: Хранит данные о товаре, получаемые с сервера.
Поля:
id: string — уникальный идентификатор.
title: string — название товара.
price?: number | null — цена.
image: string — URL изображения.
description: string — описание.
category: string — категория.


Использование: Для отображения карточек товаров и деталей в модальном окне.


ICartItem
Описание: Хранит данные о товаре в корзине.
Поля:
productId: string — ID товара.
title: string — название.
price?: number | null — цена.
quantity: number — количество.


Использование: Для отображения товаров в корзине.


ICart
Описание: Хранит корзину.
Поля:
items: ICartItem[] — список товаров.
total: number — общая сумма.


Использование: Для управления и отображения корзины.


IOrder
Описание: Хранит данные заказа для отправки на сервер.
Поля:
items: string[] — список ID товаров.
total: number — общая сумма.
address: string — адрес доставки.
email: string — email.
phone: string — телефон.
payment: 'card' | 'cash' — способ оплаты.


Использование: Для оформления заказа.


IOrderResult
Описание: Ответ сервера после отправки заказа.
Поля:
orderId: string — ID заказа.
success: boolean — статус.


Использование: Для отображения подтверждения заказа.



Дополнительные типы

IApiService
Описание: Интерфейс для API-клиента.
Методы:
get<T>(endpoint: string): Promise<T> — GET-запрос.
post<T>(endpoint: string, data: object): Promise<T> — POST-запрос.


Использование: Для взаимодействия с сервером.


Events
Описание: Перечисление событий приложения.
Значения: products:changed, product:selected, cart:changed, order:updated, order:submit, order:submitted, card:select, addToCart, removeFromCart, openCart, openOrderForm, form:change, form:submit, modal:close, order:success.
Использование: Для обработки событий через EventEmitter.



Слой модели

Класс ProductModel
Назначение: Хранит и обрабатывает данные о товарах.
Зона ответственности: Загрузка товаров, выбор товара, фильтрация.
Конструктор:
Параметры: eventEmitter: EventEmitter, api: ApiService.


Поля:
products: IProduct[] — список товаров.
selectedProduct: IProduct | null — выбранный товар.
eventEmitter: EventEmitter — для событий.
api: ApiService — для запросов к серверу.


Методы:
fetchProducts(): Promise<void> — загружает товары через api.get, сохраняет в products, генерирует products:changed.
setSelectedProduct(product: IProduct | null): void — устанавливает selectedProduct, генерирует product:selected.
filterProducts(category?: string, maxPrice?: number): IProduct[] — возвращает отфильтрованный список.




Класс CartModel
Назначение: Управляет корзиной.
Зона ответственности: Добавление, удаление, обновление товаров, подсчёт суммы.
Конструктор:
Параметры: eventEmitter: EventEmitter.


Поля:
cart: ICart — корзина (items, total).
eventEmitter: EventEmitter — для событий.


Методы:
addItem(product: IProduct): void — добавляет товар, обновляет total, генерирует cart:changed.
removeItem(productId: string): void — удаляет товар, обновляет total, генерирует cart:changed.
updateQuantity(productId: string, quantity: number): void — обновляет количество, пересчитывает total, генерирует cart:changed.
getTotal(): number — возвращает cart.total.
clear(): void — очищает cart.items и total, генерирует cart:changed.




Класс OrderModel
Назначение: Формирует и отправляет заказ.
Зона ответственности: Хранение данных формы, валидация, отправка заказа.
Конструктор:
Параметры: eventEmitter: EventEmitter, api: ApiService.


Поля:
order: Omit<IOrder, 'items' | 'total'>.
eventEmitter: EventEmitter — для событий.
api: ApiService — для запросов.


Методы:
setOrderField(field: keyof Omit<IOrder, 'items' | 'total'>, value: string): void — устанавливает поле order, генерирует order:updated.
validateField(field: keyof Omit<IOrder, 'items' | 'total'>): boolean — проверяет поле (например, пустой адрес).
getErrors(): { field: string, message: string }[] — возвращает ошибки валидации.
createOrderToPost(items: string[], total: number): IOrder — создаёт полный IOrder с items и total.
submitOrder(): Promise<IOrderResult> — отправляет заказ через api.post, генерирует order:submit, затем order:submitted.




Класс AppState
Назначение: Объединяет модели.
Зона ответственности: Координация моделей.
Конструктор:
Параметры: eventEmitter: EventEmitter.


Поля:
products: ProductModel — модель товаров.
cart: CartModel — модель корзины.
order: OrderModel — модель заказа.


Методы: Не имеет собственных методов, предоставляет доступ к моделям.


Класс ApiService
Назначение: Выполняет HTTP-запросы.
Зона ответственности: Взаимодействие с API.
Конструктор:
Параметры: baseUrl: string — адрес сервера.


Поля:
baseUrl: string — базовый URL API.


Методы:
get<T>(endpoint: string): Promise<T> — GET-запрос.
post<T>(endpoint: string, data: object): Promise<T> — POST-запрос.





Слой представления

Класс Component (базовый)
Назначение: Базовый класс для компонентов.
Зона ответственности: Управление DOM и рендеринг.
Конструктор:
Параметры: element: HTMLElement — корневой элемент.


Поля:
element: HTMLElement — корневой DOM-элемент.


Методы:
setText(element: HTMLElement, value: string): void — устанавливает текст.
setDisabled(element: HTMLElement, state: boolean): void — управляет состоянием.
render(data?: object): HTMLElement — возвращает элемент.




Класс ProductCard
Назначение: Отображает карточку товара на главной странице, в корзине или в модальном окне.
Зона ответственности: Рендеринг данных товара, обработка кликов в зависимости от контекста.
Конструктор:
Параметры: element: HTMLElement — корневой элемент карточки, context: 'catalog' | 'cart' | 'modal' — контекст отображения.


Поля:
title: HTMLElement — элемент для названия.
price: HTMLElement — элемент для цены.
image: HTMLImageElement — элемент для изображения.
description: HTMLElement — элемент для описания (только в модальном окне).
button: HTMLButtonElement — кнопка («Купить» в каталоге/модальном окне, «Убрать» в корзине).


Методы:
render(data: IProduct): HTMLElement — отображает данные товара, изменяет текст кнопки и события в зависимости от context.
События:
В catalog: клик по карточке — card:select, клик по кнопке — addToCart.
В cart: клик по кнопке — removeFromCart.
В modal: клик по кнопке — addToCart или removeFromCart (если товар в корзине).






Класс ProductList
Назначение: Отображает список карточек товаров на главной странице.
Зона ответственности: Рендеринг списка товаров, использование переданного экземпляра ProductCard.
Конструктор:
Параметры: element: HTMLElement — корневой элемент списка, card: ProductCard — экземпляр карточки.


Поля:
container: HTMLElement — контейнер для карточек.
card: ProductCard — экземпляр карточки для рендеринга.


Методы:
render(products: IProduct[]): HTMLElement — использует переданный card для отображения списка товаров.




Класс CartView
Назначение: Отображает корзину.
Зона ответственности: Рендеринг товаров в корзине, количества и суммы, открытие формы заказа.
Конструктор:
Параметры: element: HTMLElement — корневой элемент корзины, cardConstructor: typeof ProductCard — класс для создания карточек.


Поля:
items: HTMLElement — контейнер для списка товаров.
total: HTMLElement — элемент для суммы.
button: HTMLButtonElement — кнопка «Оформить заказ».


Методы:
render(cart: ICart): HTMLElement — создаёт экземпляры ProductCard с контекстом cart, отображает список и сумму (счётчик товаров обновляется через CartIcon).
События: клик по кнопке «Оформить» — openOrderForm.




Класс CartIcon
Назначение: Отображает иконку корзины на главной странице.
Зона ответственности: Обновление счётчика товаров, обработка клика для открытия корзины.
Конструктор:
Параметры: element: HTMLElement — корневой элемент иконки.


Поля:
icon: HTMLElement — элемент иконки.


Методы:
render(count: number): HTMLElement — обновляет счётчик товаров.
События: клик по иконке — openCart.




Класс Modal
Назначение: Отображает модальное окно с любым контентом.
Зона ответственности: Управление модальным окном (открытие/закрытие, рендеринг контента).
Конструктор:
Параметры: element: HTMLElement — корневой элемент модалки.


Поля:
content: HTMLElement — контейнер для контента.
closeButton: HTMLButtonElement — кнопка закрытия.


Методы:
open(content: HTMLElement): void — открывает окно, устанавливает контент.
close(): void — закрывает окно.
События: клик по кнопке закрытия или вне окна — modal:close.




Класс OrderFormStep1
Назначение: Отображает первый шаг формы заказа (оплата, адрес).
Зона ответственности: Ввод данных, отображение ошибок.
Конструктор:
Параметры: element: HTMLFormElement — корневая форма.


Поля:
payment: HTMLInputElement[] — радиокнопки для способа оплаты.
address: HTMLInputElement — поле для адреса.
submitButton: HTMLButtonElement — кнопка «Далее».


Методы:
setField(name: string, value: string): void — устанавливает значение поля.
setError(field: string, message: string): void — отображает ошибку.
События: изменение поля — form:change, отправка формы — form:submit.




Класс OrderFormStep2
Назначение: Отображает второй шаг формы заказа (email, телефон).
Зона ответственности: Ввод данных, отображение ошибок.
Конструктор:
Параметры: element: HTMLFormElement — корневая форма.


Поля:
email: HTMLInputElement — поле для email.
phone: HTMLInputElement — поле для телефона.
submitButton: HTMLButtonElement — кнопка «Оплатить».


Методы:
setField(name: string, value: string): void — устанавливает значение поля.
setError(field: string, message: string): void — отображает ошибку.
События: изменение поля — form:change, отправка формы — form:submit.




Класс SuccessView
Назначение: Отображает окно успешного заказа.
Зона ответственности: Показ подтверждения заказа.
Конструктор:
Параметры: element: HTMLElement — корневой элемент.


Поля:
orderId: HTMLElement — элемент для номера заказа.
total: HTMLElement — элемент для суммы.
button: HTMLButtonElement — кнопка «Закрыть».


Методы:
render(result: IOrderResult, total: number): HTMLElement — отображает номер заказа и сумму.
События: клик по кнопке — modal:close.





Описание событий
События обрабатываются через EventEmitter и делятся на две категории: связанные с изменением данных и генерируемые действиями пользователя.
События, связанные с изменением данных

products:changed
Описание: Генерируется при изменении списка товаров.
Источник: ProductModel.fetchProducts.
Данные: IProduct[] — обновлённый список.
Действие: Презентер вызывает ProductList.render.


product:selected
Описание: Генерируется при выборе товара.
Источник: ProductModel.setSelectedProduct.
Данные: IProduct | null — выбранный товар.
Действие: Презентер открывает модальное окно через Modal.open с ProductCard (контекст modal).


cart:changed
Описание: Генерируется при изменении корзины.
Источник: CartModel.addItem, removeItem, updateQuantity, clear.
Данные: ICart — обновлённая корзина.
Действие: Презентер вызывает CartView.render и CartIcon.render.


order:updated
Описание: Генерируется при изменении данных заказа.
Источник: OrderModel.setOrderField.
Данные: { field: string, value: string } — изменённое поле.
Действие: Презентер вызывает OrderModel.validateField, затем OrderFormStep1 или OrderFormStep2.setError.


order:submit
Описание: Генерируется перед отправкой заказа.
Источник: OrderModel.submitOrder.
Данные: IOrder — данные заказа.
Действие: Презентер уведомляет о начале отправки.


order:submitted
Описание: Генерируется после отправки заказа.
Источник: OrderModel.submitOrder.
Данные: IOrderResult — результат заказа.
Действие: Презентер открывает SuccessView через Modal.open.



События, генерируемые действиями пользователя

card:select
Описание: Пользователь кликает по карточке товара на главной странице.
Источник: ProductCard (контекст catalog).
Данные: string — ID товара.
Действие: Презентер вызывает ProductModel.setSelectedProduct.


addToCart
Описание: Пользователь нажимает «Купить».
Источник: ProductCard (контекст catalog или modal).
Данные: string — ID товара.
Действие: Презентер вызывает CartModel.addItem.


removeFromCart
Описание: Пользователь удаляет товар из корзины.
Источник: ProductCard (контекст cart или modal).
Данные: string — ID товара.
Действие: Презентер вызывает CartModel.removeItem.


openCart
Описание: Пользователь кликает по иконке корзины.
Источник: CartIcon.
Данные: Нет.
Действие: Презентер открывает корзину через CartView.render.


openOrderForm
Описание: Пользователь нажимает «Оформить заказ».
Источник: CartView.
Данные: Нет.
Действие: Презентер открывает OrderFormStep1 через Modal.open.


form:change
Описание: Пользователь изменяет поле формы.
Источник: OrderFormStep1, OrderFormStep2.
Данные: { field: string, value: string } — имя поля и значение.
Действие: Презентер вызывает OrderModel.setOrderField.


form:submit
Описание: Пользователь отправляет форму.
Источник: OrderFormStep1, OrderFormStep2.
Данные: Нет.
Действие: Для OrderFormStep1 презентер открывает OrderFormStep2. Для OrderFormStep2 презентер вызывает OrderModel.submitOrder.


modal:close
Описание: Пользователь закрывает модальное окно.
Источник: Modal.
Данные: Нет.
Действие: Презентер очищает ProductModel.selectedProduct или форму.


order:success
Описание: Пользователь закрывает окно успешного заказа.
Источник: SuccessView.
Данные: Нет.
Действие: Презентер закрывает модальное окно и очищает корзину через CartModel.clear.







