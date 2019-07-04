'use strict';

const parseConfig = require('./config');
const DevTools = require('./dev-tools');

module.exports = (hermione, opts) => {
    const config = parseConfig(opts);
    if (!config.enabled) {
        return;
    }

    hermione.on(hermione.events.SESSION_START, async (browser, {browserId, sessionId}) => {
        if (!config.browsers.includes(browserId)) {
            return;
        }

        const browserWSEndpoint = config.browserWSEndpoint({
            sessionId,
            gridUrl: hermione.config.forBrowser(browserId).gridUrl
        });

        const devtools = await DevTools.create({browserWSEndpoint});

        devtools.setScrollbarsHiddenOnNewPage();
        await devtools.hideScrollbarsOnActivePages();
    });
};
