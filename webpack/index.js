require('dotenv').config();
const WebpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const path = require('path');
const config = require('./webpack.config');

const PORT = process.env.PORT || 3000;

const compiler = webpack(config);
const server = new WebpackDevServer(
	{
		https: false,
		hot: false,
		client: false,
		host: 'localhost',
		port: PORT,
		static: {
			directory: path.join(__dirname, '../build'),
		},
		devMiddleware: {
			publicPath: `http://localhost:${PORT}/`,
			writeToDisk: true,
		},
		headers: {
			'Access-Control-Allow-Origin': '*',
		},
		allowedHosts: 'all',
	},
	compiler
);

(async () => {
	await server.start();
})();
