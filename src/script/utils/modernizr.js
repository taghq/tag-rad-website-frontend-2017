/**
 * @overview Browsernizr
 *
 * @description
 * Import (and initiate) app-wide tests.
 *
 * @author ljd
 */
// Shim HTML5
import 'browsernizr/lib/html5shiv';

// Misc test
import 'browsernizr/test/touchevents';
import 'browsernizr/test/css/flexbox';
import 'browsernizr/test/css/transitions';
import 'browsernizr/test/css/transforms3d';
import 'browsernizr/test/css/vwunit';

// Initialize and export
import Modernizr from 'browsernizr';

export default Modernizr;
