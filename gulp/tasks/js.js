/**
 * @overview
 * Parses and compiles JS into one single file using Babel, Browserify and Uglify.
 */

import gulp from 'gulp';
import plugins from '../utils/plugins';
import config from '../config';
import path from 'path';

/**
 * @function
 * @description
 * Handle any errors thrown in processing, to minimize impact on Gulp streams.
 *
 * @param {object} error
 */
function errorHandler(error) {
	if (!global.isProduction) {

		let args = Array.prototype.slice.call(arguments);

		// Send error to notification center with gulp-notify
		plugins.notify.onError({
			title: 'JS Compile Error',
			message: error && error.stack
		}).apply(this, args);

		// Keep gulp from hanging on this task
		this.emit('end');

	} else {
		// Log the error and stop the process to prevent broken code from building
		console.log(error);
		process.exit(1);
	}
}

/**
 * @function
 * @description
 * Compile and minify JS files using Browserify. In production everything is minified to a single bundle. Otherwise (in development) the JS is output with source maps.
 *
 * @param {bool} watch - Keep watching files and rebuild
 */
function buildScript(file, watch) {
	// Create bundler
	let bundler = plugins.browserify(Object.assign({}, plugins.watchify.args, {
		debug: !global.isProduction,
		entries: [file],
		ignoreWatch: ['**/node_modules/**'],
		transform: [
			plugins.babelify, // Presets are configured in .babelrc
			plugins.stringify({
				extensions: ['.html', '.svg'],
				minify: global.isProduction
			})
		]
	}));

	let basename = path.basename(file);

	// Rebundle function
	function rebundle(sync) {
		let stream = bundler.bundle();

		plugins.util.log('Bundling js:', basename);

		return stream
			.on('error', errorHandler)
			// Transform streams to play nice with NPM
			.pipe(plugins.vinylSourceStream(basename))
			.pipe(plugins.vinylBuffer())
			// Prep file
			.pipe(global.isProduction ? plugins.uglify() : plugins.util.noop())
			.pipe(plugins.rename(function(path) {
				path.basename += '.' + config.pkg.version;
			}))
			.pipe(plugins.sourcemaps.init({ loadMaps: true })) // Extract the inline sourcemaps
			.pipe(plugins.sourcemaps.write('./')) // Set folder for sourcemaps to output to
			.pipe(gulp.dest(config.paths.client.dist))
			.pipe(sync ? plugins.if(plugins.browserSync.active, plugins.browserSync.stream()) : plugins.util.noop());
	}

	if (watch) {
		bundler = plugins.watchify(bundler);
		bundler.on('update', rebundle);
		bundler.on('log', plugins.util.log);
	}

	return rebundle();
}

// Set up task
gulp.task('js', ['lint'], function() {
	let tasks = plugins.flatten(config.paths.client.jsMain).map(file => buildScript(file, !global.isProduction));
	return plugins.eventStream.merge.apply(null, tasks);
});
