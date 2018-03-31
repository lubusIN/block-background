const webpack = require( 'webpack' );
const path = require( 'path' );
const ExtractTextPlugin = require( 'extract-text-webpack-plugin' );
const inProduction = ( 'production' === process.env.NODE_ENV );
const ImageminPlugin = require( 'imagemin-webpack-plugin' ).default;
const CleanWebpackPlugin = require( 'clean-webpack-plugin' );
const WebpackRTLPlugin = require( 'webpack-rtl-plugin' );
const wpPot = require( 'wp-pot' );

// Webpack config.
const config = {
	entry: {
		background: [ './src/index.js' ],
	},

	// Tell webpack where to output.
	output: {
		path: path.resolve( __dirname, './build' ),
		filename: '[name].js',
	},

	devtool: 'source-map',
	module: {
		rules: [

			// Use Babel to compile JS.
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loaders: [
					'babel-loader',
				],
			},

			// Process css.
			{
				test: /\.css$/,
				include: /node_modules/,
				use: [ {
					loader: 'style-loader',
				}, {
					loader: 'css-loader',
				} ],
			},

			// SASS to CSS.
			{
				test: /\.scss$/,
				use: ExtractTextPlugin.extract( {
					use: [ {
						loader: 'css-loader',
						options: {
							sourceMap: true,
						},
					}, {
						loader: 'postcss-loader',
						options: {
							sourceMap: true,
							plugins: () => [ require( 'autoprefixer' ) ],
						},
					}, {
						loader: 'sass-loader',
						options: {
							sourceMap: true,
							outputStyle: ( inProduction ? 'compressed' : 'nested' ),
						},
					} ],
				} ),
			},

			// Font files.
			{
				test: /\.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: 'fonts/[name].[ext]',
							publicPath: '../',
						},
					},
				],
			},

			// Image files.
			{
				test: /\.(png|jpe?g|gif|svg)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: 'images/[name].[ext]',
							publicPath: '../',
						},
					},
				],
			},
		],
	},

	// Plugins.
	plugins: [

		// Removes the "build" folder before building.
		new CleanWebpackPlugin( [ 'build' ] ),
		new ExtractTextPlugin( '[name].css' ),

		// Create RTL css.
		new WebpackRTLPlugin(),

		// Minify images.
		// Must go after CopyWebpackPlugin above: https://github.com/Klathmon/imagemin-webpack-plugin#example-usage
		new ImageminPlugin( { test: /\.(jpe?g|png|gif|svg)$/i } ),
	],
};

// inProd?
if ( inProduction ) {
	// POT file.
	wpPot( {
		package: 'block-background',
		domain: 'cpb',
		destFile: 'languages/block-background.pot',
		relativeTo: './',
		bugReport: 'https://github.com/lubusIN/block-background/issues/new',
		team: 'LUBUS <info@lubus.in>',
	} );

	// Uglify JS.
	config.plugins.push( new webpack.optimize.UglifyJsPlugin( { sourceMap: true } ) );

	// Minify CSS.
	config.plugins.push( new webpack.LoaderOptionsPlugin( { minimize: true } ) );
}

module.exports = config;
