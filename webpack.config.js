const path									= require('path');
const webpack 						 	= require('webpack');
const { VueLoaderPlugin } 	= require('vue-loader');
const MiniCssExtractPlugin 	= require('mini-css-extract-plugin');

module.exports = {
	entry: {
		app: [
			'./src/js/app.js',
			'./src/css/style.css'
		]
	},
	output: {
		path: path.resolve(__dirname, './'),
		filename: 'public/js/[name].js'
	},
	module: {
	  rules: [
	  	{
				test: /\.vue$/,
				loader: 'vue-loader'
			},
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
          'style-loader',
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { importLoaders: 1 } },
          { 
          	loader: 'postcss-loader',
          	options: {
          		indent: 'postcss',
          		plugins: [
          			require('tailwindcss'),
          			require('autoprefixer')
          		]
          	}
          }
        ]
      }
	  ]
	},
	resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js' // 'vue/dist/vue.common.js' for webpack 1
    }
  },
	plugins: [ 
		new MiniCssExtractPlugin({
      filename: 'public/css/style.css'
    }),
    new VueLoaderPlugin(),
	]
}
