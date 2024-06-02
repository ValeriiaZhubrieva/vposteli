Модуль “Popup”. Випливаючі (модальні) вікна


Цей функціонал додає можливість використовувати випливаючі вікна. Робота модуля полягає в наступному: користувач натискає на вказаний елемент (за замовчюванням це атрибут із вказаним селектором data-popup=’selector’). При цьому до тега body додається клас popup-show. Також блокується прокручування сторінки (можна вимкнути), фокусування елементів “перелітає” на popup, із запам’ятовуванням попереднього сфокусованого елемента на сторінці. Закриття popup відбувається при натисканні кнопки закриття (за замовчуванням елемент з атрибутом data-close), по кліку на “порожньому місці” (не на popup), за натисканням кнопки ESC.

<a href="#" data-popup="#popup" class="link">Я відкриваю попап</a>

<div id="popup" aria-hidden="true" class="popup">
	<div class="popup__wrapper">
		<div class="popup__content">
			<button data-close type="button" class="popup__close">Закрити</button>
			<div class="popup__text">

			</div>
		</div>
	</div>
</div>


Для ютубу у попапі:

Щоб відкрити відеоролик у попапі, слід додати до кнопки, яка викликає попап, атрибут data-popup-youtube, а як значення вказати код ролика. Також слід вказати атрибут data-popup-youtube-place для об’єкта, в якому хочемо вивести ролик (якщо атрибут data-popup-youtube-place не буде вказано, ролик автоматично з’явиться в об’єкті з класом popup__text):

<button type="button" data-popup="#video" data-popup-youtube="6S5Zw2WuyFE">Відео</button>


<div id="video" aria-hidden="true" class="popup">
	<div class="popup__wrapper">
		<div class="popup__content">
			<button data-close type="button" class="popup__close">Закрити</button>
			<div data-youtube-place class="popup__text">

			</div>
		</div>
	</div>
</div>


Методи та події

Методи

Працювати з попапом з будь-якого місця можна імпортувати змінну flsModules:

import { flsModules } from "./modules.js";

Далі звернутися до класу popup та працювати з методом, наприклад open()

flsModules.popup.open('#popup')

де #popup селектор попапа

!!!!!!!!!!Увага! Після створення білду проєкту (режим build) константа flsModules змінюється на modules_flsModules. Тобто запит буде modules_flsModules.popup.open(‘#popup’);



Події

У класі попапів існує ряд подій:

beforePopupOpen – спрацює перед відкриттям попапа
afterPopupOpen – спрацює після відкриття попапа
beforePopupClose – спрацює перед відкриттям попапа
afterPopupClose – спрацює після відкриття попапа

Щоб працювати з подією вішаємо прослуховування на document

document.addEventListener("afterPopupOpen", function (e) {
	// Попап
	const currentPopup = e.detail.popup;
});