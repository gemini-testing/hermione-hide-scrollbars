'use strict';

const parseConfig = require('./config');
const DevTools = require('./dev-tools');
const debug = require('debug')('hermione-hide-scrollbars');

module.exports = (hermione, opts) => {
    const config = parseConfig(opts);
    if (!config.enabled) {
        return;
    }

    hermione.on(hermione.events.SESSION_START, async (browser, {browserId, sessionId}) => {
        if (!config.browsers.includes(browserId)) {
            return;
        }

        try {
            const browserWSEndpoint = config.browserWSEndpoint({
                sessionId,
                gridUrl: hermione.config.forBrowser(browserId).gridUrl
            });

            debug(`connecting devtools via endpoint ${browserWSEndpoint}`);
            const devtools = await DevTools.create({browserWSEndpoint});

            debug('preventing scrollbars on any new page');
            devtools.setScrollbarsHiddenOnNewPage();

            debug('hiding scrollbars on active pages');
            await devtools.hideScrollbarsOnActivePages();
        } catch (e) {
            throw (e.error || e);
        }
    });
};
