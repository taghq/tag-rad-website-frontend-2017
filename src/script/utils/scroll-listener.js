/**
 * @name koalition.helpers:ScrollListener
 * @description
 * Virtual scroll listeners for DOM elements. Based on [VirtualScroll](https://raw.githubusercontent.com/drojdjou/bartekdrozdz.com/master/static/src/framework/VirtualScroll.js)
 */

import raf from 'raf';

const hasWheelEvent = 'onwheel' in document;
const hasMouseWheelEvent = 'onmousewheel' in document;
const hasTouch = 'ontouchstart' in document;
const hasTouchWin = navigator.msMaxTouchPoints && navigator.msMaxTouchPoints > 1;
const hasPointer = !!window.navigator.msPointerEnabled;
const hasKeyDown = 'onkeydown' in document;



const DEFAULTS = {
	fps: 60,
	timeout: 200,
	passive: true
};



export default class ScrollListener {

	static getScroll() {
		let { scrollX, scrollY } = window;

		if (scrollX === undefined || scrollY === undefined) {
			scrollX = document.documentElement.scrollLeft || document.body.scrollLeft || 0;
			scrollY = document.documentElement.scrollTop || document.body.scrollTop || 0;
		}

		return {
			scrollX,
			scrollY
		};
	}

	/**
	 * @constructor
	 * @param {object} options
	 * @property {number} fps - frequency / updates per second
	 * @property {number} timeout - amount of time in ms to allow for same result before turning off listeners
	 */
	constructor(options) {
		this.options = Object.assign({}, DEFAULTS, options);
		this._listeners = [];
		this._internalListeners = [];
	}

	/**
	 * Notify consumer listeners
	 * @private
	 * @param {object} event
	 */
	_notify(event) {
		const { _listeners } = this;
		for (let i = 0; i < _listeners.length; i++) {
			_listeners[i](event);
		}
	}

	/**
	 * Continously listen for scroll position
	 * @private
	 * @param {object} event - original event object
	 */
	_start(event) {
		this._stop();
		const { fps, timeout } = this.options;
		const { scrollX, scrollY } = ScrollListener.getScroll();

		// Calculate delta based on last event if available
		let deltaX = 0,
			deltaY = 0,
			isFirstEvent = false;
		if (!this._lastSeen) {
			isFirstEvent = true;

		} else {
			const { scrollX: lastSeenScrollX, scrollY: lastSeenScrollY } = this._lastSeen;
			deltaX = scrollX - (lastSeenScrollX || scrollX);
			deltaY = scrollY - (lastSeenScrollY || scrollY);
		}

		this._lastSeen = {
			scrollX,
			scrollY
		};

		// If we're not moving and this isn't the first event, don't trigger events.
		if (!isFirstEvent && deltaX === 0 && deltaY === 0) {
			this._stopTime = this._stopTime || Date.now();

		// Else, trigger events
		} else {
			this._stopTime = null;

			const internalEvent = {
				x: scrollX,
				y: scrollY,
				deltaX,
				deltaY,
				originalEvent: event
			};
			this._notify(internalEvent);
		}

		// Check if we haven't updated for the duration of our timeout
		let doLoop = true;
		if (this._stopTime && Date.now() - this._stopTime >= timeout) {
			doLoop = false;
			this._stopTime = null;
		}

		// If we're still moving / updating, keep looping
		if (doLoop) {
			this._startTimer = setTimeout(() => this._animationFrame = raf(() => {
				this._start(event);
			}), 1000 / fps);
		}
	}

	/**
	 * Stop continous listener
	 * @private
	 */
	_stop() {
		clearTimeout(this._startTimer);
		raf.cancel(this._animationFrame);
	}

	/**
	 * Register internal listeners
	 * @private
	 * @param {object} event
	 */
	_initListeners() {
		this._destroyListeners();

		this._internalListeners = [];

		this._addListeners();

		this._isInitialized = true;
	}

	/**
	 * Add internal listeners to a single element
	 * @private
	 * @param {object} event
	 */
	_addListeners(element = document) {
		let { passive } = this.options;

		let syntheticListener = event => this._start(event);
		element.addEventListener('syntheticScroll', syntheticListener, { passive });
		this._internalListeners.push({
			element: element,
			type: 'synthetic',
			listener: syntheticListener
		});

		let loadListener = event => setTimeout(() => {
			this._start(event);
		}, 500);
		window.addEventListener('load', loadListener, { passive });
		this._internalListeners.push({
			element: window,
			type: 'load',
			listener: loadListener
		});

		let scrollListener = event => this._start(event);
		element.addEventListener('scroll', scrollListener, { passive });
		this._internalListeners.push({
			element: element,
			type: 'scroll',
			listener: scrollListener
		});

		if (hasWheelEvent) {
			let wheelListener = event => this._start(event);
			element.addEventListener('wheel', wheelListener, { passive });
			this._internalListeners.push({
				element: element,
				type: 'wheel',
				listener: wheelListener
			});
		}

		if (hasMouseWheelEvent) {
			let mouseWheelListener = event => this._start(event);
			element.addEventListener('mousewheel', mouseWheelListener, { passive });
			this._internalListeners.push({
				element: element,
				type: 'mousewheel',
				listener: mouseWheelListener
			});
		}

		if (hasTouch) {
			let touchStartListener = event => this._start(event);
			element.addEventListener('touchstart', touchStartListener, { passive });
			this._internalListeners.push({
				element: element,
				type: 'touchstart',
				listener: touchStartListener
			});

			let touchMoveListener = event => this._start(event);
			element.addEventListener('touchmove', touchMoveListener, { passive });
			this._internalListeners.push({
				element: element,
				type: 'touchmove',
				listener: touchMoveListener
			});
		}

		if (hasPointer && hasTouchWin) {
			this._bodyTouchAction = document.body.style.msTouchAction;
			document.body.style.msTouchAction = 'none';

			let touchStartListener = event => this._start(event);
			element.addEventListener('MSPointerDown', touchStartListener, true);
			this._internalListeners.push({
				element: element,
				type: 'MSPointerDown',
				listener: touchStartListener,
				useCapture: true
			});

			let touchMoveListener = event => this._start(event);
			element.addEventListener('MSPointerMove', touchMoveListener, true);
			this._internalListeners.push({
				element: element,
				type: 'MSPointerMove',
				listener: touchMoveListener,
				useCapture: true
			});
		}

		if (hasKeyDown) {
			let keyDownListener = event => this._start(event);
			element.addEventListener('keydown', keyDownListener, { passive });
			this._internalListeners.push({
				element: element,
				type: 'keydown',
				listener: keyDownListener
			});
		}

	}

	/**
	 * Deregister internal listeners
	 * @private
	 * @param {object} event
	 */
	_destroyListeners() {
		this._internalListeners.forEach(obj => obj.element.removeEventListener(obj.type, obj.listener, obj.useCapture));

		this._isInitialized = false;
	}

	/**
	 * Hook for consumer to register VS listener
	 * @public
	 * @param {function} listener
	 */
	on(listener) {
		if (!this._isInitialized) {
			this._initListeners();
		}

		return this._listeners.push(listener);
	}

	/**
	 * Hook for consumer to deregister VS listener
	 * @public
	 * @param {number} index
	 */
	off(index) {
		if (index) {
			this._listeners.splice(index, 1);
		} else {
			this._listeners = [];
		}

		if (this._listeners.length <= 0) {
			this._destroyListeners();
		}
	}

	/**
	 * Destroy all listeners
	 * @public
	 */
	destroy() {
		this.off();
	}
}
