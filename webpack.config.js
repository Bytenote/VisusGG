const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const NODE_ENV = process.env.NODE_ENV || 'development';
const ASSET_PATH = process.env.ASSET_PATH || '/';

const options = {
	mode: NODE_ENV,
	entry: {
		background: path.join(__dirname, 'scripts', 'background', 'index.js'),
		content: path.join(__dirname, 'scripts', 'content', 'index.js'),
		popup: path.join(__dirname, 'scripts', 'popup', 'index.js'),
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'build'),
		clean: true,
		publicPath: ASSET_PATH,
	},
	module: {
		rules: [
			{
				test: /\.css$/i,
				use: ['style-loader', 'css-loader'],
			},
			{
				test: new RegExp(
					'.(' + ['jpg', 'jpeg', 'png', 'svg'].join('|') + ')$'
				),
				type: 'asset/resource',
				exclude: /node_modules/,
			},
			{
				test: /\.html$/,
				loader: 'html-loader',
				exclude: /node_modules/,
			},
		],
	},
	plugins: [
		new CleanWebpackPlugin({ verbose: false }),
		new webpack.ProgressPlugin(),
		new CopyWebpackPlugin({
			patterns: [
				{
					from: 'manifest.json',
					to: path.join(__dirname, 'build'),
					force: true,
					transform: function (content) {
						return Buffer.from(
							JSON.stringify({
								description:
									process.env.npm_package_description,
								version: process.env.npm_package_version,
								...JSON.parse(content.toString()),
							})
						);
					},
				},
			],
		}),
		new CopyWebpackPlugin({
			patterns: [
				{
					from: 'assets/img',
					to: path.join(__dirname, 'build'),
					force: true,
				},
			],
		}),
		new HtmlWebpackPlugin({
			template: path.join(__dirname, 'scripts', 'popup', 'index.html'),
			filename: 'popup.html',
			chunks: ['popup'],
			cache: false,
		}),
	],
	infrastructureLogging: {
		level: 'info',
	},
};

if (NODE_ENV === 'development') {
	options.devtool = 'cheap-module-source-map';
} else {
	options.optimization = {
		minimize: true,
		minimizer: [
			new TerserPlugin({
				extractComments: false,
			}),
		],
	};
}

module.exports = options;
