'use strict';

const EventEmitter = require('events');
const _ = require('lodash');
const plugin = require('../');
const DevTools = require('../dev-tools');

const events = {
    SESSION_START: 'fooBar'
};

describe('hermione-reassert-view', () => {
    const sandbox = sinon.createSandbox();

    beforeEach(() => {
        sandbox.stub(DevTools, 'create').resolves(Object.create(DevTools.prototype));
        sandbox.stub(DevTools.prototype, 'hideScrollbarsOnActivePages').resolves();
        sandbox.stub(DevTools.prototype, 'setScrollbarsHiddenOnNewPage');
    });

    afterEach(() => sandbox.restore());

    const mkHermioneStub = () => {
        const hermione = new EventEmitter();
        hermione.events = events;
        hermione.config = {
            forBrowser: sinon.stub().returns({})
        };

        return hermione;
    };

    const stubBrowser = () => ({});

    const init = (config = {}) => {
        const defaultBrowser = 'default_bro';

        _.defaults(config, {
            browserWSEndpoint: () => {},
            browsers: [defaultBrowser]
        });

        const hermione = mkHermioneStub();
        plugin(hermione, config);

        const emitSessionStart = (data = {}) => {
            _.defaults(data, {
                browserId: defaultBrowser
            });

            return hermione.emit(events.SESSION_START, stubBrowser(), data);
        };

        return {hermione, emitSessionStart};
    };

    it('should be enabled by default', () => {
        const {hermione} = init();

        assert.equal(hermione.listenerCount(events.SESSION_START), 1);
    });

    it('should do nothing if disabled', () => {
        const {hermione} = init({enabled: false});

        assert.equal(hermione.listenerCount(events.SESSION_START), 0);
    });

    it('should not create devtools client for unknown browser', async () => {
        const {emitSessionStart} = init({
            browsers: ['bro']
        });

        await emitSessionStart({browserId: 'otherBro'});

        assert.notCalled(DevTools.create);
    });

    it('should create devtools client for specified browser', async () => {
        const {emitSessionStart} = init({
            browsers: ['bro']
        });

        await emitSessionStart({browserId: 'bro'});

        assert.calledOnce(DevTools.create);
    });

    it('should create devtools with endpoint from config', async () => {
        const {emitSessionStart} = init({
            browserWSEndpoint: () => 'ws://foo/bar'
        });

        await emitSessionStart();

        assert.calledOnceWith(DevTools.create, {browserWSEndpoint: 'ws://foo/bar'});
    });

    it('should pass session id to browserWSEndpoint function', async () => {
        const browserWSEndpoint = sinon.spy();
        const {emitSessionStart} = init({browserWSEndpoint});

        await emitSessionStart({sessionId: 'foo'});

        assert.calledOnceWith(browserWSEndpoint, sinon.match({sessionId: 'foo'}));
    });

    it('should pass grid url to browserWSEndpoint function', async () => {
        const browserWSEndpoint = sinon.spy();
        const {hermione, emitSessionStart} = init({
            browserWSEndpoint,
            browsers: ['bro']
        });

        hermione.config.forBrowser.withArgs('bro').returns({
            gridUrl: 'http://foo/bar'
        });

        await emitSessionStart({browserId: 'bro'});

        assert.calledOnceWith(browserWSEndpoint, sinon.match({gridUrl: 'http://foo/bar'}));
    });

    it('should hide scrollbars on active pages', async () => {
        const {emitSessionStart} = init();

        await emitSessionStart();

        assert.calledOnce(DevTools.prototype.hideScrollbarsOnActivePages);
    });

    it('should hide scrollbars on any new page', async () => {
        const {emitSessionStart} = init();

        await emitSessionStart();

        assert.calledOnce(DevTools.prototype.setScrollbarsHiddenOnNewPage);
    });
});
