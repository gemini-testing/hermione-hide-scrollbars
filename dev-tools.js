'use strict';

const puppeteer = require('puppeteer-core');
const debug = require('debug')('hermione-hide-scrollbars');

module.exports = class DevTools {
    static async create({browserWSEndpoint}) {
        const browser = await puppeteer.connect({
            browserWSEndpoint,
            defaultViewport: null
        });

        return new DevTools(browser);
    }

    constructor(browser) {
        this._browser = browser;
    }

    async hideScrollbarsOnActivePages() {
        const pages = await this._browser.pages();
        await Promise.all(pages.map((p) => disableScrollBarsOnPage(p.target())));
    }

    setScrollbarsHiddenOnNewPage() {
        this._browser.on('targetcreated', (target) => {
            if (target.page()) {
                debug('new page opened. Hiding scrollbars');
                disableScrollBarsOnPage(target).catch((e) => console.error(e.stack));
            }
        });
    }
};

async function disableScrollBarsOnPage(target) {
    const client = await target.createCDPSession();
    await client.send('Emulation.setScrollbarsHidden', {hidden: true});
}
