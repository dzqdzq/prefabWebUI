const rewire = require('rewire');
const path = require('path');
const defaults = rewire('react-scripts/scripts/start.js');
const oldconfigFactory = defaults.__get__('configFactory');
defaults.__set__('configFactory', (...args) => {
  const config = oldconfigFactory(...args);
  config.resolve.alias['@'] = path.resolve(__dirname, 'src');
  return config;
});
