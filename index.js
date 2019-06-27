'use strict';

const parseConfig = require('./config');

module.exports = (hermione, opts) => {
    const config = parseConfig(opts);
    if (!config.enabled) {
        return;
    }
};
