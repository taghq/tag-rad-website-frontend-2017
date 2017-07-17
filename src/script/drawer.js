import ready from './utils/ready';

import addClass from 'dom-helpers/class/addClass';
import hasClass from 'dom-helpers/class/hasClass';
import removeClass from 'dom-helpers/class/removeClass';


// Heroes
ready(() => {
	let drawer = document.getElementsByClassName('drawer'),
		header = document.getElementsByClassName('header'),
		toggle = document.getElementsByClassName('header__nav-toggle');

	if (drawer && drawer[0] && header && header[0] && toggle && toggle[0]) {
		drawer = drawer[0];
		header = header[0];
		toggle = toggle[0];

		toggle.addEventListener('click', event => {
			event.preventDefault();

			if (hasClass(drawer, 'drawer--open')) {
				removeClass(header, 'header--drawer-open');
				removeClass(drawer, 'drawer--open');
			} else {
				addClass(header, 'header--drawer-open');
				addClass(drawer, 'drawer--open');
			}
		});
	}
});
