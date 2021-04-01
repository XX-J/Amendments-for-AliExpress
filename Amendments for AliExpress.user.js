
// ==UserScript==
// @name:ru        Исправления AliExpress
// @name           Amendments for AliExpress
// @version        2.1
// @description:ru Замена русскоязычных ссылок на англоязычном сайте их англоязычными аналогами. Отключение автоперевода комментариев к товарам на английский язык. Добавление опций отображения 50 и 100 заказов в списке заказов. Изменяемые настройки сохраняются.
// @description    Replacement of Russian links to the English site of their English-speaking counterparts. Disabling autotranslate comments to the goods in the English language. The addition display options of 50 and 100 orders in the orders list. Changed settings are saved.
// @icon           https://ae01.alicdn.com/images/eng/wholesale/icon/aliexpress.ico
// @update         https://github.com/XX-J/Amendments-for-AliExpress/raw/main/Amendments for AliExpress.user.js
// @author         XX-J...
// @include        *://aliexpress.com/*
// @include        *://*.aliexpress.com/*
// @include        *://aliexpress.ru/store/*
// @include        *://*.aliexpress.ru/store/*
// ==/UserScript==


//    Меняем ссылки на англоязычные

function Replace(link) { if (/aliexpress.ru/i.test(link.href)) link.href = decodeURIComponent(link.href.replace('aliexpress.ru/','aliexpress.com/')); };
function SplitForReplace(links) { for (var i = 0; i < links.length; ++i) Replace(links[i]); };

document.addEventListener('DOMNodeInserted', function(event) {
  if (!event || !event.target || !(event.target instanceof HTMLElement)) return;
  if (event.target instanceof HTMLAnchorElement) Replace(event.target);
  SplitForReplace(event.target.getElementsByTagName('a'));
}, { passive: true });
SplitForReplace(document.getElementsByTagName('a'));


if (!localStorage.translate) localStorage.translate = ' N ';
if (localStorage.translate) {  //  Проверяем доступность DOM Storage

//    Отключаем перевод отзывов на английский

  if (/feedback.aliexpress.com/i.test(window.location)) {

    let Input = document.querySelector('#translate'), Stor = localStorage.translate;
    if (Input.value != Stor) { Input.value = Stor; Input.parentNode.submit(); };

    document.querySelector('#cb-translate').onclick = () => { localStorage.translate = (Stor == ' N ') ? ' Y ' : ' N ' };
  };

//    Устанавливаем отображение 50-и заказов в списке заказов

  if (/trade.aliexpress.com/i.test(window.location)) {

    if (!localStorage.pageSize) localStorage.pageSize = '50';
    let Input = document.querySelector('[name="pageSize"]'), Stor = localStorage.pageSize;
    if (Input.value != Stor) { Input.value = Stor; Input.parentNode.submit(); };

    document.querySelectorAll('#simple-pager-page-size, #full-pager-page-size').forEach( Sel => {

      let CrOpt50 = document.createElement('option'), CrOpt100 = document.createElement('option');
      CrOpt50.value = '50'; CrOpt50.text = '50/Page'; Sel.add(CrOpt50);
      CrOpt100.value = '100'; CrOpt100.text = '100/Page'; Sel.add(CrOpt100);

      Sel.querySelector('[value="' + Stor + '"]').selected = true;

      Sel.onchange = () => { localStorage.pageSize = Sel.value };
    });
  };

};

