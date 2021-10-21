
// ==UserScript==
// @name:ru         Исправления AliExpress
// @name            Amendments for AliExpress
// @version         2.4
// @description:ru  Замена русскоязычных ссылок на англоязычном сайте их англоязычными аналогами. Отключение автоперевода комментариев к товарам на английский язык. Добавление опций отображения 50 и 100 заказов в списке заказов. Изменяемые настройки сохраняются.
// @description     Replacement of Russian links to the English site of their English-speaking counterparts. Disabling autotranslate comments to the goods in the English language. The addition display options of 50 and 100 orders in the orders list. Changed settings are saved.
// @icon            https://ae01.alicdn.com/images/eng/wholesale/icon/aliexpress.ico
// @update          https://github.com/XX-J/Amendments-for-AliExpress/raw/main/Amendments for AliExpress.user.js
// @author          XX-J...
// @include         *://aliexpress.com/*
// @include         *://*.aliexpress.com/*
// @include         *://aliexpress.ru/store/*
// @include         *://*.aliexpress.ru/store/*
// ==/UserScript==


//  Меняем ссылки на международные:

function Replace(link) {
  if (!!link.getAttribute('href')) {
    link.hostname = link.hostname.replace('.ru', '.com');
//  При международных ссылках на товары доп. параметр "pdp_ext_f={...}" в этих ссылках вызывает 404 после открытия:
    link.href = decodeURIComponent(link.href).replace(/&pdp_ext_f=.+/, '');
  }
}
function SplitForReplace(links) { for (var i = 0; i < links.length; ++i) Replace(links[i]) }

document.addEventListener('DOMNodeInserted', function(event) {
  if (!event || !event.target || !(event.target instanceof HTMLElement)) return;
  if (event.target instanceof HTMLAnchorElement) Replace(event.target);
  SplitForReplace(event.target.getElementsByTagName('a'));
}, { passive: true });

SplitForReplace(document.getElementsByTagName('a'));


if (!localStorage.translate) localStorage.translate = ' N ';
if (localStorage.translate) {  //  <- Проверяем доступность DOM Storage.

//  Отключаем перевод отзывов на английский:

  if (window.location.hostname.includes('feedback')) {

    let InputElement = document.querySelector('#translate'), SavedValue = localStorage.translate;
    if (InputElement.value != SavedValue) { InputElement.value = SavedValue; InputElement.parentNode.submit(); }

    document.querySelector('#cb-translate').onclick = () => { localStorage.translate = (SavedValue == ' N ') ? ' Y ' : ' N ' }
  }

//  Устанавливаем отображение 50-и заказов в списке заказов:

  if (window.location.hostname.includes('trade')) {

    if (!localStorage.pageSize) localStorage.pageSize = 50;
    let InputElement = document.querySelector('[name="pageSize"]'), SavedValue = localStorage.pageSize;

    document.querySelectorAll('#simple-pager-page-size, #full-pager-page-size').forEach( SelectedElement => {

      if (InputElement.value != SavedValue) { InputElement.value = SavedValue; InputElement.parentNode.submit(); }

      let Option50 = document.createElement('option'), Option100 = document.createElement('option');
      Option50.value = 50; Option50.text = '50/Page'; SelectedElement.add(Option50);
      Option100.value = 100; Option100.text = '100/Page'; SelectedElement.add(Option100);

      SelectedElement.value = SavedValue; SelectedElement.onchange = () => { localStorage.pageSize = SelectedElement.value }
    });
  }

}
