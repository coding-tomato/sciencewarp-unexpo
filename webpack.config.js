const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
	entry: './src/game.ts',
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/
			}
		]
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js']
	},
	node: {
		fs: 'empty'
	},
	output: {
		filename: 'game.js',
		path: path.resolve(__dirname, 'dist')
	},
	devServer: {
	  contentBase: path.resolve(__dirname, 'dist')
	},
	plugins: [
	  new CopyWebpackPlugin([
	    {
        from: path.resolve(__dirname, 'index.html'),
        to: path.resolve(__dirname, 'dist')
      },
      {
        from: path.resolve(__dirname, 'master.css'),
        to: path.resolve(__dirname, 'dist')
      },
      {
        from: path.resolve(__dirname, 'assets', '**', '*'),
        to: path.resolve(__dirname, 'dist')
      }
  ])],
	mode: 'development'
};
