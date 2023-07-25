const rewire = require('rewire');
const path = require('path');
const defaults = rewire('react-scripts/scripts/build.js');
const config = defaults.__get__('config');

config.output.filename = 'static/js/[name].js';
config.output.chunkFilename = 'static/js/[name].chunk.js';
config.resolve.alias['@'] = path.resolve(__dirname, 'src');
