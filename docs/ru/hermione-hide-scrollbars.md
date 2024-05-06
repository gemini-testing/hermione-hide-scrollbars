# hermione-hide-scrollbars

## Обзор

Используйте плагин `hermione-hide-scrollbars`, чтобы скрывать скролл-бары в тестах, которые запускаются в Chrome-браузерах.

Для получения доступа к браузеру через [Chrome DevTools Protocol (CDP)][CDP] плагин использует пакет [puppeteer-core](https://github.com/GoogleChrome/puppeteer).

Чтобы скрывать скролл-бары используется команда CDP [Emulation.setScrollbarsHidden][set-scrollbars-hidden].

**Обновите Chrome-браузер до версии 109.0 и выше**, чтобы данная функциональность работала в ваших тестах.

**Чтобы использовать Chrome версии от 72.1 (включительно) до 109.0 (не включительно)**, используйте hermione-hide-scrollbars@1.0.1.

*Более ранние версии Chrome-браузеров (<72.1) не поддерживают команду _Emulation.setScrollbarsHidden_.*

## Установка

```bash
npm install -D hermione-hide-scrollbars
```

## Настройка

Необходимо подключить плагин в разделе `plugins` конфига `hermione`:

```javascript
module.exports = {
    plugins: {
        'hermione-hide-scrollbars': {
            enabled: true,
            browsers: ['chrome'],
            browserWSEndpoint: ({ sessionId, gridUrl }) => `ws://${url.parse(gridUrl).host}/devtools/${sessionId}`
        },

        // другие плагины гермионы...
    },

    // другие настройки гермионы...
};
```

### Расшифровка параметров конфигурации

| **Параметр** | **Тип** | **По&nbsp;умолчанию** | **Описание** |
| :--- | :---: | :---: | :--- |
| enabled | Boolean | true | Включить / отключить плагин. |
| browsers | Array | `[ ]` | Список браузеров, для которых будет применена логика отключения скролл-баров. |
| browserWSEndpoint | Function | _N/A_ | Функция, которая должна вернуть URL для работы с браузером через [CDP][CDP]. Чтобы можно было вычислить URL, в функцию передаются идентификатор сессии и ссылка на грид: параметры передаются в виде объекта с ключами _sessionId и gridUrl_. |

### Передача параметров через CLI

Все параметры плагина, которые можно определить в конфиге, можно также передать в виде опций командной строки или через переменные окружения во время запуска гермионы. Используйте префикс `--hide-scrollbars-` для опций командной строки и `hermione_hide_scrollbars_` &mdash; для переменных окружения.

## Полезные ссылки

* [Исходники плагина hermione-hide-scrollbars][hermione-hide-scrollbars]
* [setScrollbarsHidden][set-scrollbars-hidden]
* [createCDPSession](https://github.com/puppeteer/puppeteer/blob/main/docs/api/puppeteer.target.createcdpsession.md)
* [CDPSession class](https://github.com/puppeteer/puppeteer/blob/main/docs/api/puppeteer.cdpsession.md)

[hermione-hide-scrollbars]: https://github.com/gemini-testing/hermione-hide-scrollbars/
[set-scrollbars-hidden]: https://chromedevtools.github.io/devtools-protocol/tot/Emulation/#method-setScrollbarsHidden
[CDP]: https://chromedevtools.github.io/devtools-protocol/
