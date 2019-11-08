const path						= require('path');
const webpack 					= require('webpack');

module.exports = {
	entry: {
		app: [
			'./src/js/app.js',
		]
	},
	output: {
		path: path.resolve(__dirname, './'),
		filename: 'public/js/[name].js'
	},
	module: {
	  rules: [
			{ 
				test: /\.js$/, 
				exclude: /node_modules/, 
				loader: "babel-loader" 
			},
			{
				test: /.css$/,
				use: [
					{ 
						loader: 'css-loader', 
						options: { 
							importLoaders: 1 
						} 
					}
				]
			}
	  ]
	},
	plugins: [ 
	]
}
