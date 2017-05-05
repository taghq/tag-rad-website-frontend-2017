import gulp from 'gulp';
import plugins from '../utils/plugins';
import config from '../config';

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
			title: 'SASS Compile Error',
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
 * Compile SASS stylesheets to CSS
 */
gulp.task('style', function() {
	return gulp.src(plugins.flatten(config.paths.client.styleFiles))
		.pipe(plugins.sass({
			outputStyle: 'expanded',
			errLogToConsole: true
		}).on('error', errorHandler))
		.pipe(plugins.postcss([plugins.autoprefixer()]))
		.pipe(plugins.rename(function(path) {
			if (path.basename === config.paths.client.styleMainBasename) {
				path.basename += '.' + config.pkg.version;
			}
		}))
		.pipe(isProduction ? plugins.cleanCss({
			compatibility: 'ie9',
			format: {
				wrapAt: 1024,
				breaks: {
					afterAtRule: true,
					afterComment: true
				}
			},
			level: 1
		}) : plugins.util.noop())
		.pipe(gulp.dest(config.paths.client.dist))
		.pipe(plugins.if(plugins.browserSync.active, plugins.browserSync.stream()));
});
