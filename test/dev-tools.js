'use strict';

const _ = require('lodash');
const EventEmitter2 = require('eventemitter2');
const puppeteer = require('puppeteer-core');
const DevTools = require('../dev-tools');

describe('dev-tools', () => {
    const sandbox = sinon.createSandbox();

    const stubBrowser = () => {
        const browser = new EventEmitter2();
        browser.pages = sinon.stub().resolves([]);
        return browser;
    };

    beforeEach(() => {
        sandbox.stub(puppeteer, 'connect').resolves(stubBrowser());
    });

    afterEach(() => sandbox.restore());

    describe('create', () => {
        it('should connect puppeteer', async () => {
            await DevTools.create({browserWSEndpoint: 'ws://foo/bar'});

            assert.calledOnceWith(puppeteer.connect, sinon.match({browserWSEndpoint: 'ws://foo/bar'}));
        });

        it('should not modify viewport size on connect', async () => {
            await DevTools.create({});

            assert.calledWithMatch(puppeteer.connect, {defaultViewport: null});
        });
    });

    describe('scrollbars', () => {
        const initDevTools_ = async () => {
            const browser = stubBrowser();
            puppeteer.connect.resolves(browser);

            return {
                browser,
                devtools: await DevTools.create({})
            };
        };

        // puppeteer internal structs
        const stubTarget_ = (opts = {}) => {
            const client = {
                send: sinon.stub()
            };

            const target = _.defaults(opts, {
                createCDPSession: sinon.stub().resolves(client),
                page: sinon.stub().resolves(Object.create(null))
            });

            const page = {
                target: () => target
            };

            return {target, client, page};
        };

        describe('setScrollbarsHiddenOnNewPage', () => {
            it('should hide scrollbars for any created page', async () => {
                const {devtools, browser} = await initDevTools_();
                const {target, client} = stubTarget_();

                devtools.setScrollbarsHiddenOnNewPage();

                await browser.emitAsync('targetcreated', target); // in order to test sync event with async handler

                assert.calledOnceWith(client.send, 'Emulation.setScrollbarsHidden', {hidden: true});
            });

            it('should do nothing for any other created object', async () => {
                const {devtools, browser} = await initDevTools_();
                const {target, client} = stubTarget_({page: () => null});

                devtools.setScrollbarsHiddenOnNewPage();

                await browser.emitAsync('targetcreated', target); // in order to test sync event with async handler

                assert.notCalled(client.send);
            });

            it('should not fail on errors', async () => {
                sandbox.stub(console, 'error');

                const err = new Error('o.O');
                const {devtools, browser} = await initDevTools_();
                const {target} = stubTarget_({page: sinon.stub().rejects(err)});
                devtools.setScrollbarsHiddenOnNewPage();

                await assert.isFulfilled(browser.emitAsync('targetcreated', target));

                assert.calledOnceWith(console.error, 'Coulnd\'t connect to CDP session:', err);
            });
        });

        describe('hideScrollbarsOnActivePages', () => {
            it('should hide scrollbars on all active pages', async () => {
                const {devtools, browser} = await initDevTools_();
                const {page: page1, client: client1} = stubTarget_();
                const {page: page2, client: client2} = stubTarget_();

                browser.pages.resolves([page1, page2]);

                await devtools.hideScrollbarsOnActivePages();

                assert.calledOnceWith(client1.send, 'Emulation.setScrollbarsHidden', {hidden: true});
                assert.calledOnceWith(client2.send, 'Emulation.setScrollbarsHidden', {hidden: true});
            });
        });
    });
});
