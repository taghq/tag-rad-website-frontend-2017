'use strict';

import './custom-event-polyfill';
import Spring from './spring';
import ScrollListener from './scroll-listener';

/**
 * Scroll animation helper
 * @private
 */
const spring = new Spring({
	callback: ({ current }) => setScrollTop(current),
	acceleration: 0.05,
	margin: 1
});


/**
 * Prevent scroll events while we're animating
 * @private
 */
let listener;
document.addEventListener('DOMContentLoaded', () => {
	listener = new ScrollListener({ id: 'koa-scroll-to' });
	listener.on(event => isAnimatingScroll() === true && event.originalEvent.preventDefault());
});

/**
 * Get scrollTop cross browser
 * @private
 */
function getScrollTop() {
	return ScrollListener.getScroll().scrollY;
}

/**
 * Set scrollTop cross browser
 * @private
 * @param {integer} px
 */
function setScrollTop(px) {
	document.documentElement.scrollTop = document.body.scrollTop = px;

	// Throw a synthetic scroll event, which in turn can be caught by the ScrollListener class
	const event = new CustomEvent('syntheticScroll', {
		bubbles: true,
		cancelable: false,
		detail: null,
		type: 'syntheticScroll'
	});
	document.dispatchEvent(event);
}

/**
 * Animate scrollTop to a given pixel value
 * @public
 * @param {integer} target
 */
export default function scrollTo(target) {
	spring
		.forceState({
			current: getScrollTop(),
			target: getScrollTop()
		})
		.setTarget(target);
}

/**
 * Animate scrollTop a given distance
 * @public
 * @param {integer} distance
 */
export function scrollDistance(distance) {
	scrollTo(getScrollTop() + distance);
}

/**
 * Animate scrollTop to given element
 * @public
 * @param {DOMElement} element
 */
export function scrollToElement(element) {
	scrollTo(element.getBoundingClientRect().top);
}

/**
 * Getter for checking animation status
 * @public
 */
export function isAnimatingScroll() {
	return !!spring._isAnimating;
}
