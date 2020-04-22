const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const environment = process.env.NODE_ENV;
let hash = (environment === 'production') ? '.[hash]' : '';
const ExtractAppCSS = new MiniCssExtractPlugin({
	filename: '[name].[hash].css'
});

module.exports = {
    mode: "development",

    devtool: "source-map",
	entry: './src/index.tsx',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'main.js'
	},
    resolve: {
        extensions: [".ts", ".tsx", ".js"]
	},
	devServer: {
		contentBase: path.join(__dirname, 'dist'),
		compress: true,
		port: 5000
	},
	watch: true,
    module: {
		rules: [
			/*{
				test: /\.ts(x?)$/,
				exclude: '/(node_modules|dist)/',
				loader: 'eslint-loader',
			},*/
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "ts-loader"
                    }
                ]
            },
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader"
			},
			{
				test: /\.scss$/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							sourceMap: true
						}
					},
					{
						loader: 'resolve-url-loader',
						options: {
							engine: 'postcss',
							sourceMap: true
						}
					},
					{
						loader: 'sass-loader',
						options: {
							sourceMap: true
						}
					}
				]
			},
			{
				test: /\.css$/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							sourceMap: true
						}
					},
					{
						loader: 'resolve-url-loader',
						options: {
							engine: 'postcss',
							sourceMap: true
						}
					}
				]
			}
        ]
	},

	plugins: [
		new HtmlWebpackPlugin({
			template: "./index.html"
		}),
		ExtractAppCSS
	],
};
