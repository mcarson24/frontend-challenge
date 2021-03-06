const path									= require('path');
const MiniCssExtractPlugin 	= require('mini-css-extract-plugin');

module.exports = {
	entry: {
		app: [
			'./src/js/app.js',
			'./src/css/style.css'
		]
	},
	output: {
		path: path.resolve('./'),
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
				test: /\.js$/,
				use: ["source-map-loader"],
				enforce: "pre"
			},
			{
        test: /\.css$/,
        use: [
          // 'style-loader',
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { importLoaders: 1 } },
          'postcss-loader'
        ]
			}
		]
	},
	plugins: [ 
		new MiniCssExtractPlugin({
      filename: 'public/css/style.css'
    }),
	]
}
