require('dotenv').config();
const webpack = require('webpack');
const config = require('../webpack.config');

config.mode = 'production';

webpack(config, function (err) {
	if (err) throw err;
});
