var path = require('path');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: './src/main.js',
	output: {
		path: path.resolve(__dirname, "./release"),
		filename: "[name].js",
		chunkFilename: "[name].js",
		libraryTarget: "umd",
		publicPath: './'
	},
	module: {
		//加载器配置
		rules: [{
				test: /\.css$/
				,use: ExtractTextPlugin.extract({
					use: 'css-loader'
				})
			} 
			,{
				test: /\.scss$/
				,use: ExtractTextPlugin.extract({
					fallbackLoader: "style-loader",
					loader: "css-loader!sass-loader",
				})
			}
			,{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				loader: 'babel-loader'
			}

		]
	}
	,externals: {
		'jquery': 'jQuery'
	}
	,plugins: [
		new ExtractTextPlugin('styles.css')
		,new HtmlWebpackPlugin({
			template: './src/template.ejs'
		})
	]
}