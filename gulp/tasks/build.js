import gulp from 'gulp';
import plugins from '../utils/plugins';

// In NPM it is setup with: gulp clean && gulp build --production
gulp.task('build', plugins.sequence('clean', ['style', 'js', 'img', 'html', 'copy']));
