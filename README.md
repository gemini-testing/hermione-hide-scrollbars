# hermione-hide-scrollbars

Plugin for [hermione](https://github.com/gemini-testing/hermione) which hides scrollbars in Chrome browsers. Uses [puppeteer-core](https://github.com/GoogleChrome/puppeteer) inside.
More info about hermione plugins in [hermione](https://github.com/gemini-testing/hermione#plugins).

## Installation

```bash
$ npm install --save hermione-hide-scrollbars
```

## Configuration

In hermione config:

```js
module.exports = {
    // ...

    plugins: {
        'hermione-hide-scrollbars': {
            enabled: true,
            browsers: ['chrome'],
            browserWSEndpoint: ({sessionId, gridUrl}) => `ws://${url.parse(gridUrl).host}/devtools/${sessionId}`
        }
    },

    // ...
};
```
