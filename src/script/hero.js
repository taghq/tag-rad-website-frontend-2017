import ready from './utils/ready';
import { scrollDistance } from './utils/scroll-to';

// Heroes
ready(() => {
	let heroes = document.getElementsByClassName('hero');

	for (let i = 0; i < heroes.length; i++) {
		let hero = heroes[i],
			arrow = hero.getElementsByClassName('hero__arrow');

		if (arrow && arrow[0]) {
			arrow = arrow[0];

			arrow.addEventListener('click', event => {
				event.preventDefault();

				let rect = hero.getBoundingClientRect();
				scrollDistance(rect.top + rect.height);
			});
		}
	}
});
