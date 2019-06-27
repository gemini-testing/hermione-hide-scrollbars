'use strict';

const {root, section, option} = require('gemini-configparser');

const ENV_PREFIX = 'hermione_hide_scrollbars_';
const CLI_PREFIX = '--hermione-hide-scrollbars-';

const assertBool = (value, name) => {
    if (typeof value !== 'boolean') {
        throw new Error(`'${name}' must be boolean, but got '${value}'`);
    }
};

const getParser = () => {
    return root(section({
        enabled: option({
            defaultValue: true,
            parseEnv: JSON.parse,
            parseCli: JSON.parse,
            validate: (value) => assertBool(value, 'enabled')
        })
    }), {envPrefix: ENV_PREFIX, cliPrefix: CLI_PREFIX});
};

module.exports = (options) => {
    const {env, argv} = process;

    return getParser()({options, env, argv});
};
