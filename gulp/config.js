// Get data from package.json
import getPackageJson from './utils/get-package-json';

// Base constants
const clientSrcDir = 'src';
const clientDistDir = 'dist';

export default {
	// Server & BrowserSync settings
	browserPort: 3000,
	UIPort: 3001,

	// Paths
	paths: {
		client: {
			src: clientSrcDir,
			dist: clientDistDir,
			styleMainBasename: 'style',
			styleFiles: [
				clientSrcDir + '/*.{scss,sass}',
				clientSrcDir + '/style/**/*.{scss,sass,css}'
			],
			jsMain: [
				clientSrcDir + '/script/script.js'
			],
			jsLintFiles: [
				clientSrcDir + '/**/*.js',
				'gulp/**/*.js',
				'!' + clientSrcDir + '/lib/**/*.js',
			],
			imgFiles: [
				clientSrcDir + '/screenshot.png',
				clientSrcDir + '/media/**/*.{png,jpeg,jpg,gif,svg}'
			],
			svgSpriteFiles: [
				clientSrcDir + '/media/icons/**/*.svg'
			],
			htmlFiles: [
				clientSrcDir + '/**/*.{html,php,xml}'
			],
			staticFiles: [
				clientSrcDir + '/media/**/*.{mp4,cur,ico}',
				clientSrcDir + '/*.ico',
				clientSrcDir + '/media/fonts/**/*.*'
			]
		},
		versionFiles: {
			json: [
				'package.json'
			]
		}
	},

	// Package
	pkg: getPackageJson()
};
