# hermione-hide-scrollbars

## Overview

Use the `hermione-hide-scrollbars` plugin to hide scrollbars in tests that run in Chrome browsers.

To access the browser via [Chrome DevTools Protocol (CDP)][CDP], the plugin uses the [puppeteer-core](https://github.com/GoogleChrome/puppeteer) package.

To hide scroll bars, the CDP [Emulation.setScrollbarsHidden][set-scrollbars-hidden] command is used.

**Update your Chrome browser to version 109.0 and higher** so that this functionality works in your tests.

**To use chrome browsers versions from 72.1 (inclusive) to 109.0 (not inclusive)**, use hermione-hide-scrollbars@1.0.1.

*Earlier versions of Chrome browsers do not support the _Emulation.setScrollbarsHidden_ command.*

## Install

```bash
npm install -D hermione-hide-scrollbars
```

## Setup

Add the plugin to the `plugins` section of the `hermione` config:

```javascript
module.exports = {
    plugins: {
        'hermione-hide-scrollbars': {
            enabled: true,
            browsers: ['chrome'],
            browserWSEndpoint: ({ sessionId, gridUrl }) => `ws://${url.parse(gridUrl).host}/devtools/${sessionId}`
        },

        // other hermione plugins...
    },

    // other hermione settings...
};
```

### Description of configuration parameters

| **Parameter** | **Type** | **Default&nbsp;value** | **Description** |
| :--- | :---: | :---: | :--- |
| enabled | Boolean | true | Enable / disable the plugin. |
| browsers | Array | `[ ]` | A list of browsers for which the logic of disabling scroll bars will be applied. |
| browserWSEndpoint | Function | _N/A_ | A function that should return the URL to work with the browser via [CDP][CDP]. To be able to define the URL, the session ID and a link to the grid are passed to the function: the parameters are passed as an object with the keys _sessionId and gridUrl_. |

### Passing parameters via the CLI

All plugin parameters that can be defined in the config can also be passed as command-line options or through environment variables during the launch of Hermione. Use the prefix `--hide-scrollbars-` for command line options and `hermione_hide_scrollbars_` for environment variables.

## Useful links

* [hermione-hide-scrollbars plugin sources][hermione-hide-scrollbars]
* [setScrollbarsHidden][set-scrollbars-hidden]
* [createCDPSession](https://github.com/puppeteer/puppeteer/blob/main/docs/api/puppeteer.target.createcdpsession.md)
* [CDPSession class](https://github.com/puppeteer/puppeteer/blob/main/docs/api/puppeteer.cdpsession.md)

[hermione-hide-scrollbars]: https://github.com/gemini-testing/hermione-hide-scrollbars/
[set-scrollbars-hidden]: https://chromedevtools.github.io/devtools-protocol/tot/Emulation/#method-setScrollbarsHidden
[CDP]: https://chromedevtools.github.io/devtools-protocol/
