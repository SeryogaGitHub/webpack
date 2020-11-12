const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');

const isDev = process.env.NODE_ENV === "development";
const isProd = !isDev;

const optimization = () => {
	const config = {
		splitChunks: {
			chunks: 'all'
		},
		minimize: true,
	}
	if(isProd){
		config.minimizer = [
			new OptimizeCssAssetsWebpackPlugin()
			// new TerserWebpackPlugin()
		]
	}

	return config;
}

const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`;

const cssLoaders = extra => {
	const loaders = [
		{
			loader: MiniCssExtractPlugin.loader, //розділяє css з js записує в окремий файл
			options: {
				hmr: isDev,
				reloadAll: true
			},
		},
		'css-loader'
	]

	if(extra){
		loaders.push(extra)
	}
}

console.log(process.env.NODE_ENV);

module.exports = {
	context: path.resolve(__dirname, 'src'),
	mode: "development",
	entry: {
		app: "./index.js" //app назва вхідного файла
	},
	devtool: "source-map",
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src'),
			'@css': path.resolve(__dirname, 'src/css'),
			'@sass': path.resolve(__dirname, 'src/sass'),
			'@img': path.resolve(__dirname, 'src/img'),
		}
	},
	output: {
		filename: filename('js'), //назва вихідних файлів [name]
		path: path.resolve(__dirname, 'build'), //шлях
		// publicPath: '/'
	},
	optimization: optimization(),
	module: {
		rules: [
			{
				test: /\.(jpg|png|svg)$/,
				use: {
					loader: 'file-loader'
				}
			},
			{
				test: /\.(ttf|woff|woff2|eot)$/,
				use: {
					loader: 'file-loader'
				}
			},
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/, //виключення підключення бібліотеки
				use: {

					loader: 'babel-loader',
					options: {
						sourceMap: false,
						presets: ['@babel/preset-env'] //може підключатися в окремому файлі .babelrc
					}
				}
			},
			{
				test: /\.css$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader, //розділяє css з js записує в окремий файл
						options: {
							hmr: isDev,
							reloadAll: true
						}
					},
					{
						loader: 'css-loader',
						options: {sourceMap: true}
					}, {
						loader: 'postcss-loader',
						options: {
							sourceMap: true,
							postcssOptions: {
								plugins: [
									[
										'autoprefixer',
										{
											// Options
										},
									],
								],
							}
						}
					}
				],
			},{
				test: /\.s[ac]ss$/,
				exclude: /node_modules/,
				use:[
					{
						loader: MiniCssExtractPlugin.loader, //розділяє css з js записує в окремий файл
						options: {
							hmr: isDev,
							reloadAll: true
						}
					},
					{
						loader: 'css-loader',
						options: {sourceMap: true}
					},
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: {
								plugins: [
									[
										'autoprefixer',
										{
											// Options
										},
									],
								],
							},
							sourceMap: true,
						}
					}, {
						loader: 'sass-loader',
						options: {sourceMap: true}
					}
				],
			},
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: "index.html",
			filename: 'index.html'
		}),
		new HtmlWebpackPlugin({
			template: "production.html",
			filename: 'production.html'
		}),
		new CleanWebpackPlugin(),
		new MiniCssExtractPlugin({
		  filename: filename('css'),
		})
	],
	devServer: {
		port: 7701,
		hot: isDev,
		// inline: false, // режим контролю процеса
		// contentBase: path.resolve(__dirname, '/build') //для того щоб правильно вказало шляхи до файлів в білді
	}
};
