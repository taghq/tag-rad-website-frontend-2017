import gulp from 'gulp';
import plugins from '../utils/plugins';
import config from '../config';
import getPackageJson from '../utils/get-package-json';

/**
 * @method
 * @description
 * Bump version number in all relevant files
 */
gulp.task('bump', function() {
	// Get package
	let pkg = getPackageJson();
	let currentVersion = pkg.version;

	// Increment version
	let newVersion = plugins.semver.inc(pkg.version, plugins.util.env.bump ? plugins.util.env.bump : 'patch');

	// Update theme version
	gulp.src(config.paths.versionFiles.wordpressStyle, {
		base: './'
	})
		.pipe(plugins.replace('Version:            ' + currentVersion, 'Version:            ' + newVersion))
		.pipe(gulp.dest('./'));

	// Update JSONs
	return gulp.src(plugins.flatten(config.paths.versionFiles.json), {
		base: './'
	})
		.pipe(plugins.bump({
			version: newVersion
		}))
		.pipe(gulp.dest('./'));
});
