Проект: Веб-ларёк
Интернет-магазин с каталогом товаров, корзиной и оформлением заказа.
Используемый стек

Язык: TypeScript
Сборка: Vite
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
Слой презентера: Координирует взаимодействие через события. Код презентера размещён в основном скрипте (index.ts), а не в отдельном классе.

События обрабатываются через класс EventEmitter. Пример взаимодействия (добавление товара в корзину):

View: Класс ProductCard реагирует на клик кнопки «Добавить в корзину» и генерирует событие addToCart с ID товара.
Presenter: В index.ts слушатель события вызывает метод CartModel.addItem, передавая данные товара.
Model: CartModel добавляет товар в поле cart.items, обновляет cart.total и генерирует событие cart:changed.
Presenter: Слушатель события cart:changed вызывает метод CartView.render, передавая обновлённые данные cart.
View: Класс CartView перерисовывает корзину, отображая новый список товаров и сумму.

Описание данных
Интерфейсы

IProduct
Описание: Хранит данные о товаре, получаемые с сервера.
Поля:
id: string — уникальный идентификатор.
title: string — название товара.
price: number — цена.
image: string — URL изображения.
description: string — описание.
category: string — категория.


Использование: Для отображения карточек товаров и деталей в модальном окне.


ICartItem
Описание: Хранит данные о товаре в корзине.
Поля:
productId: string — ID товара.
title: string — название.
price: number — цена.
quantity: number — количество.


Использование: Для отображения товаров в корзине.


ICart
Описание: Хранит корзину.
Поля:
items: ICartItem[] — список товаров.
total: number — общая сумма.


Использование: Для управления и отображения корзины.


IOrder
Описание: Хранит данные заказа.
Поля:
items: string[] — ID товаров.
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



Слой модели

Класс ProductModel
Назначение: Хранит и обрабатывает данные о товарах, загружаемых с сервера.
Зона ответственности: Загрузка товаров, выбор товара для просмотра, фильтрация.
Конструктор:
Параметры: eventEmitter: EventEmitter — для генерации событий.


Поля:
products: IProduct[] — список товаров.
selectedProduct: IProduct | null — выбранный товар для модального окна.
eventEmitter: EventEmitter — для отправки событий.


Методы:
fetchProducts(): Promise<void> — загружает товары с сервера через ApiService, сохраняет в products, генерирует событие products:changed.
setSelectedProduct(product: IProduct | null): void — устанавливает selectedProduct, генерирует событие product:selected.
filterProducts(category?: string, maxPrice?: number): IProduct[] — возвращает отфильтрованный список товаров.




Класс CartModel
Назначение: Управляет корзиной.
Зона ответственности: Добавление, удаление, обновление товаров в корзине, подсчёт суммы.
Конструктор:
Параметры: eventEmitter: EventEmitter — для генерации событий.


Поля:
cart: ICart — объект корзины (items и total).
eventEmitter: EventEmitter — для отправки событий.


Методы:
addItem(product: IProduct): void — добавляет товар в cart.items, обновляет total, генерирует событие cart:changed.
removeItem(productId: string): void — удаляет товар из cart.items, обновляет total, генерирует событие cart:changed.
updateQuantity(productId: string, quantity: number): void — обновляет количество, пересчитывает total, генерирует событие cart:changed.
getTotal(): number — возвращает cart.total.
clear(): void — очищает cart.items и total, генерирует событие cart:changed.




Класс OrderModel
Назначение: Формирует и отправляет заказ.
Зона ответственности: Хранение данных формы заказа, отправка на сервер.
Конструктор:
Параметры: eventEmitter: EventEmitter — для генерации событий.


Поля:
order: IOrder — данные заказа.
eventEmitter: EventEmitter — для отправки событий.


Методы:
setOrderField(field: keyof IOrder, value: string): void — устанавливает поле order, генерирует событие order:updated.
submitOrder(): Promise<IOrderResult> — отправляет order на сервер через ApiService, генерирует событие order:submitted.




Класс AppState
Назначение: Объединяет модели для доступа к данным.
Зона ответственности: Координация моделей.
Конструктор:
Параметры: eventEmitter: EventEmitter — для передачи моделям.


Поля:
products: ProductModel — модель товаров.
cart: CartModel — модель корзины.
order: OrderModel — модель заказа.


Методы: Не имеет собственных методов, предоставляет доступ к моделям.


Класс ApiService
Назначение: Выполняет HTTP-запросы к серверу.
Зона ответственности: Взаимодействие с API.
Конструктор:
Параметры: baseUrl: string — адрес сервера (из .env).


Поля:
baseUrl: string — базовый URL API.


Методы:
get<T>(endpoint: string): Promise<T> — выполняет GET-запрос, возвращает данные.
post<T>(endpoint: string, data: object): Promise<T> — выполняет POST-запрос, возвращает ответ.





Слой представления

Класс Component (базовый)
Назначение: Базовый класс для всех компонентов представления.
Зона ответственности: Управление DOM-элементами и их рендерингом.
Конструктор:
Параметры: element: HTMLElement — корневой элемент компонента.


Поля:
element: HTMLElement — корневой DOM-элемент.


Методы:
setText(element: HTMLElement, value: string): void — устанавливает текст в элементе.
setDisabled(element: HTMLElement, state: boolean): void — управляет состоянием элемента.
render(data?: object): HTMLElement — возвращает корневой элемент.




Класс ProductCard
Назначение: Отображает карточку товара.
Зона ответственности: Рендеринг данных товара и обработка кликов.
Конструктор:
Параметры: element: HTMLElement — корневой элемент карточки.


Поля:
title: HTMLElement — элемент для названия.
price: HTMLElement — элемент для цены.
image: HTMLImageElement — элемент для изображения.
button: HTMLButtonElement — кнопка «Добавить в корзину».


Методы:
Для данных IProduct реализован сеттер render(data: IProduct): HTMLElement — обновляет название, цену, изображение.
События: клик по карточке генерирует card:select, клик по кнопке — addToCart.




Класс ProductList
Назначение: Отображает список карточек товаров.
Зона ответственности: Рендеринг списка товаров.
Конструктор:
Параметры: element: HTMLElement — корневой элемент списка.


Поля:
container: HTMLElement — контейнер для карточек.


Методы:
render(products: IProduct[]): HTMLElement — отображает список карточек, используя ProductCard.




Класс CartView
Назначение: Отображает корзину.
Зона ответственности: Рендеринг товаров в корзине, количества и суммы.
Конструктор:
Параметры: element: HTMLElement — корневой элемент корзины.


Поля:
items: HTMLElement — контейнер для списка товаров.
total: HTMLElement — элемент для суммы.
button: HTMLButtonElement — кнопка «Оформить заказ».


Методы:
render(cart: ICart): HTMLElement — отображает список товаров, сумму.
События: клик по кнопке удаления — removeFromCart, клик по «Оформить» — openOrderForm.




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
События: клик по кнопке закрытия — modal:close.




Класс Form
Назначение: Отображает и обрабатывает формы (например, для заказа).
Зона ответственности: Обработка ввода данных и отправка формы.
Конструктор:
Параметры: element: HTMLFormElement — корневая форма.


Поля:
fields: HTMLInputElement[] — поля формы (адрес, email, телефон).
submitButton: HTMLButtonElement — кнопка отправки.


Методы:
setField(name: string, value: string): void — устанавливает значение поля.
validate(): boolean — проверяет корректность формы.
События: отправка формы — form:submit, изменение поля — form:change.





Описание событий
События обрабатываются через EventEmitter и делятся на две категории: связанные с изменением данных и генерируемые действиями пользователя.
События, связанные с изменением данных

products:changed
Описание: Генерируется при изменении списка товаров в ProductModel.
Источник: ProductModel.fetchProducts после загрузки товаров.
Данные: IProduct[] — обновлённый список товаров.
Действие: Презентер вызывает ProductList.render, передавая новые данные для отображения списка товаров.


product:selected
Описание: Генерируется при выборе товара для просмотра.
Источник: ProductModel.setSelectedProduct.
Данные: IProduct | null — выбранный товар.
Действие: Презентер открывает модальное окно через Modal.open, передавая контент (например, карточку товара).


cart:changed
Описание: Генерируется при изменении корзины (добавление, удаление, изменение количества).
Источник: CartModel.addItem, removeItem, updateQuantity, clear.
Данные: ICart — обновлённая корзина.
Действие: Презентер вызывает CartView.render, обновляя отображение корзины.


order:updated
Описание: Генерируется при изменении данных заказа.
Источник: OrderModel.setOrderField.
Данные: IOrder — обновлённые данные заказа.
Действие: Презентер обновляет форму через Form.setField или проверяет валидность.


order:submitted
Описание: Генерируется после отправки заказа.
Источник: OrderModel.submitOrder.
Данные: IOrderResult — результат заказа.
Действие: Презентер открывает модальное окно с подтверждением через Modal.open.



События, генерируемые действиями пользователя

card:select
Описание: Пользователь кликает по карточке товара.
Источник: ProductCard (клик по карточке).
Данные: string — ID товара.
Действие: Презентер вызывает ProductModel.setSelectedProduct, что приводит к событию product:selected.


addToCart
Описание: Пользователь нажимает «Добавить в корзину».
Источник: ProductCard (клик по кнопке).
Данные: string — ID товара.
Действие: Презентер вызывает CartModel.addItem, что приводит к событию cart:changed.


removeFromCart
Описание: Пользователь удаляет товар из корзины.
Источник: CartView (клик по кнопке удаления).
Данные: string — ID товара.
Действие: Презентер вызывает CartModel.removeItem, что приводит к событию cart:changed.


openOrderForm
Описание: Пользователь нажимает «Оформить заказ».
Источник: CartView (клик по кнопке).
Данные: Нет.
Действие: Презентер открывает модальное окно с формой через Modal.open.


form:change
Описание: Пользователь изменяет поле формы.
Источник: Form (изменение поля ввода).
Данные: { field: string, value: string } — имя поля и значение.
Действие: Презентер вызывает OrderModel.setOrderField, что приводит к событию order:updated.


form:submit
Описание: Пользователь отправляет форму заказа.
Источник: Form (клик по кнопке отправки).
Данные: Нет.
Действие: Презентер вызывает OrderModel.submitOrder, что приводит к событию order:submitted.


modal:close
Описание: Пользователь закрывает модальное окно.
Источник: Modal (клик по кнопке закрытия).
Данные: Нет.
Действие: Презентер очищает ProductModel.selectedProduct или выполняет другие действия (например, очистка формы).



UML-схема
(Схема будет создана в Draw.IO и экспортирована в PNG. Описывает классы и связи: AppState → ProductModel, CartModel, OrderModel; ProductCard, CartView → EventEmitter.)
Проект: Веб-ларёк
Интернет-магазин с каталогом товаров, корзиной и оформлением заказа.
Используемый стек

Язык: TypeScript
Сборка: Vite
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
Слой презентера: Координирует взаимодействие через события. Код презентера размещён в основном скрипте (index.ts), а не в отдельном классе.

События обрабатываются через класс EventEmitter. Пример взаимодействия (добавление товара в корзину):

View: Класс ProductCard реагирует на клик кнопки «Добавить в корзину» и генерирует событие addToCart с ID товара.
Presenter: В index.ts слушатель события вызывает метод CartModel.addItem, передавая данные товара.
Model: CartModel добавляет товар в поле cart.items, обновляет cart.total и генерирует событие cart:changed.
Presenter: Слушатель события cart:changed вызывает метод CartView.render, передавая обновлённые данные cart.
View: Класс CartView перерисовывает корзину, отображая новый список товаров и сумму.

Описание данных
Интерфейсы

IProduct
Описание: Хранит данные о товаре, получаемые с сервера.
Поля:
id: string — уникальный идентификатор.
title: string — название товара.
price: number — цена.
image: string — URL изображения.
description: string — описание.
category: string — категория.


Использование: Для отображения карточек товаров и деталей в модальном окне.


ICartItem
Описание: Хранит данные о товаре в корзине.
Поля:
productId: string — ID товара.
title: string — название.
price: number — цена.
quantity: number — количество.


Использование: Для отображения товаров в корзине.


ICart
Описание: Хранит корзину.
Поля:
items: ICartItem[] — список товаров.
total: number — общая сумма.


Использование: Для управления и отображения корзины.


IOrder
Описание: Хранит данные заказа.
Поля:
items: string[] — ID товаров.
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



Слой модели

Класс ProductModel
Назначение: Хранит и обрабатывает данные о товарах, загружаемых с сервера.
Зона ответственности: Загрузка товаров, выбор товара для просмотра, фильтрация.
Конструктор:
Параметры: eventEmitter: EventEmitter — для генерации событий.


Поля:
products: IProduct[] — список товаров.
selectedProduct: IProduct | null — выбранный товар для модального окна.
eventEmitter: EventEmitter — для отправки событий.


Методы:
fetchProducts(): Promise<void> — загружает товары с сервера через ApiService, сохраняет в products, генерирует событие products:changed.
setSelectedProduct(product: IProduct | null): void — устанавливает selectedProduct, генерирует событие product:selected.
filterProducts(category?: string, maxPrice?: number): IProduct[] — возвращает отфильтрованный список товаров.




Класс CartModel
Назначение: Управляет корзиной.
Зона ответственности: Добавление, удаление, обновление товаров в корзине, подсчёт суммы.
Конструктор:
Параметры: eventEmitter: EventEmitter — для генерации событий.


Поля:
cart: ICart — объект корзины (items и total).
eventEmitter: EventEmitter — для отправки событий.


Методы:
addItem(product: IProduct): void — добавляет товар в cart.items, обновляет total, генерирует событие cart:changed.
removeItem(productId: string): void — удаляет товар из cart.items, обновляет total, генерирует событие cart:changed.
updateQuantity(productId: string, quantity: number): void — обновляет количество, пересчитывает total, генерирует событие cart:changed.
getTotal(): number — возвращает cart.total.
clear(): void — очищает cart.items и total, генерирует событие cart:changed.




Класс OrderModel
Назначение: Формирует и отправляет заказ.
Зона ответственности: Хранение данных формы заказа, отправка на сервер.
Конструктор:
Параметры: eventEmitter: EventEmitter — для генерации событий.


Поля:
order: IOrder — данные заказа.
eventEmitter: EventEmitter — для отправки событий.


Методы:
setOrderField(field: keyof IOrder, value: string): void — устанавливает поле order, генерирует событие order:updated.
submitOrder(): Promise<IOrderResult> — отправляет order на сервер через ApiService, генерирует событие order:submitted.




Класс AppState
Назначение: Объединяет модели для доступа к данным.
Зона ответственности: Координация моделей.
Конструктор:
Параметры: eventEmitter: EventEmitter — для передачи моделям.


Поля:
products: ProductModel — модель товаров.
cart: CartModel — модель корзины.
order: OrderModel — модель заказа.


Методы: Не имеет собственных методов, предоставляет доступ к моделям.


Класс ApiService
Назначение: Выполняет HTTP-запросы к серверу.
Зона ответственности: Взаимодействие с API.
Конструктор:
Параметры: baseUrl: string — адрес сервера (из .env).


Поля:
baseUrl: string — базовый URL API.


Методы:
get<T>(endpoint: string): Promise<T> — выполняет GET-запрос, возвращает данные.
post<T>(endpoint: string, data: object): Promise<T> — выполняет POST-запрос, возвращает ответ.





Слой представления

Класс Component (базовый)
Назначение: Базовый класс для всех компонентов представления.
Зона ответственности: Управление DOM-элементами и их рендерингом.
Конструктор:
Параметры: element: HTMLElement — корневой элемент компонента.


Поля:
element: HTMLElement — корневой DOM-элемент.


Методы:
setText(element: HTMLElement, value: string): void — устанавливает текст в элементе.
setDisabled(element: HTMLElement, state: boolean): void — управляет состоянием элемента.
render(data?: object): HTMLElement — возвращает корневой элемент.




Класс ProductCard
Назначение: Отображает карточку товара.
Зона ответственности: Рендеринг данных товара и обработка кликов.
Конструктор:
Параметры: element: HTMLElement — корневой элемент карточки.


Поля:
title: HTMLElement — элемент для названия.
price: HTMLElement — элемент для цены.
image: HTMLImageElement — элемент для изображения.
button: HTMLButtonElement — кнопка «Добавить в корзину».


Методы:
Для данных IProduct реализован сеттер render(data: IProduct): HTMLElement — обновляет название, цену, изображение.
События: клик по карточке генерирует card:select, клик по кнопке — addToCart.




Класс ProductList
Назначение: Отображает список карточек товаров.
Зона ответственности: Рендеринг списка товаров.
Конструктор:
Параметры: element: HTMLElement — корневой элемент списка.


Поля:
container: HTMLElement — контейнер для карточек.


Методы:
render(products: IProduct[]): HTMLElement — отображает список карточек, используя ProductCard.




Класс CartView
Назначение: Отображает корзину.
Зона ответственности: Рендеринг товаров в корзине, количества и суммы.
Конструктор:
Параметры: element: HTMLElement — корневой элемент корзины.


Поля:
items: HTMLElement — контейнер для списка товаров.
total: HTMLElement — элемент для суммы.
button: HTMLButtonElement — кнопка «Оформить заказ».


Методы:
render(cart: ICart): HTMLElement — отображает список товаров, сумму.
События: клик по кнопке удаления — removeFromCart, клик по «Оформить» — openOrderForm.




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
События: клик по кнопке закрытия — modal:close.




Класс Form
Назначение: Отображает и обрабатывает формы (например, для заказа).
Зона ответственности: Обработка ввода данных и отправка формы.
Конструктор:
Параметры: element: HTMLFormElement — корневая форма.


Поля:
fields: HTMLInputElement[] — поля формы (адрес, email, телефон).
submitButton: HTMLButtonElement — кнопка отправки.


Методы:
setField(name: string, value: string): void — устанавливает значение поля.
validate(): boolean — проверяет корректность формы.
События: отправка формы — form:submit, изменение поля — form:change.





Описание событий
События обрабатываются через EventEmitter и делятся на две категории: связанные с изменением данных и генерируемые действиями пользователя.
События, связанные с изменением данных

products:changed
Описание: Генерируется при изменении списка товаров в ProductModel.
Источник: ProductModel.fetchProducts после загрузки товаров.
Данные: IProduct[] — обновлённый список товаров.
Действие: Презентер вызывает ProductList.render, передавая новые данные для отображения списка товаров.


product:selected
Описание: Генерируется при выборе товара для просмотра.
Источник: ProductModel.setSelectedProduct.
Данные: IProduct | null — выбранный товар.
Действие: Презентер открывает модальное окно через Modal.open, передавая контент (например, карточку товара).


cart:changed
Описание: Генерируется при изменении корзины (добавление, удаление, изменение количества).
Источник: CartModel.addItem, removeItem, updateQuantity, clear.
Данные: ICart — обновлённая корзина.
Действие: Презентер вызывает CartView.render, обновляя отображение корзины.


order:updated
Описание: Генерируется при изменении данных заказа.
Источник: OrderModel.setOrderField.
Данные: IOrder — обновлённые данные заказа.
Действие: Презентер обновляет форму через Form.setField или проверяет валидность.


order:submitted
Описание: Генерируется после отправки заказа.
Источник: OrderModel.submitOrder.
Данные: IOrderResult — результат заказа.
Действие: Презентер открывает модальное окно с подтверждением через Modal.open.



События, генерируемые действиями пользователя

card:select
Описание: Пользователь кликает по карточке товара.
Источник: ProductCard (клик по карточке).
Данные: string — ID товара.
Действие: Презентер вызывает ProductModel.setSelectedProduct, что приводит к событию product:selected.


addToCart
Описание: Пользователь нажимает «Добавить в корзину».
Источник: ProductCard (клик по кнопке).
Данные: string — ID товара.
Действие: Презентер вызывает CartModel.addItem, что приводит к событию cart:changed.


removeFromCart
Описание: Пользователь удаляет товар из корзины.
Источник: CartView (клик по кнопке удаления).
Данные: string — ID товара.
Действие: Презентер вызывает CartModel.removeItem, что приводит к событию cart:changed.


openOrderForm
Описание: Пользователь нажимает «Оформить заказ».
Источник: CartView (клик по кнопке).
Данные: Нет.
Действие: Презентер открывает модальное окно с формой через Modal.open.


form:change
Описание: Пользователь изменяет поле формы.
Источник: Form (изменение поля ввода).
Данные: { field: string, value: string } — имя поля и значение.
Действие: Презентер вызывает OrderModel.setOrderField, что приводит к событию order:updated.


form:submit
Описание: Пользователь отправляет форму заказа.
Источник: Form (клик по кнопке отправки).
Данные: Нет.
Действие: Презентер вызывает OrderModel.submitOrder, что приводит к событию order:submitted.


modal:close
Описание: Пользователь закрывает модальное окно.
Источник: Modal (клик по кнопке закрытия).
Данные: Нет.
Действие: Презентер очищает ProductModel.selectedProduct или выполняет другие действия (например, очистка формы).



UML-схема
(Схема будет создана в Draw.IO и экспортирована в PNG. Описывает классы и связи: AppState → ProductModel, CartModel, OrderModel; ProductCard, CartView → EventEmitter.)
