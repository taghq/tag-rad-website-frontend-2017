// Load all our plugins
export default require('gulp-load-plugins')({
	pattern: [
		'gulp-*', // Load all plugins with `gulp-` prefix. Nifty!
		'autoprefixer',
		'babelify',
		'browserify',
		'browser-sync',
		'del',
		'event-stream',
		'flatten',
		'hintify',
		'eslintify',
		'semver',
		'stringify',
		'vinyl-buffer',
		'vinyl-source-stream',
		'watchify'
	]
});
