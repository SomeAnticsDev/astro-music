import {
  getLink,
  getNavigationType,
  getPathId,
  isBackNavigation,
  shouldNotIntercept,
  updateTheDOMSomehow,
} from './utils'

navigation.addEventListener('navigate', (navigateEvent) => {
	const fromPath = location.pathname;
	const toUrl = new URL(navigateEvent.destination.url);
	const toPath = toUrl.pathname;
	const navigationType = getNavigationType(fromPath, toPath);
	if (navigationType === 'home-to-product') {
		const handler = async function() {
			const transition = document.createDocumentTransition();
			const clickedLink = getLink(toPath);
			const image = clickedLink.querySelector('.product__img');
			image.classList.add('product-image');
			const bg = clickedLink.querySelector('.product__bg');
			bg.classList.add('product-bg');
			transition.start(() => {
				image.classList.remove('product-image');
				bg.classList.remove('product-bg');
				const id = getPathId(toPath);
				const template = document.getElementById(`product-${id}`);
				updateTheDOMSomehow(template.innerHTML);
			}).then(async () => {
				const response = await fetch(`/fragments${toPath}`);
				const html = await response.text();
				updateTheDOMSomehow(html);
			});
		}
		navigateEvent.transitionWhile(handler());
	} else if (navigationType === 'product-to-home') {
		const handler = async function() {
			const response = await fetch(`/fragments${toPath}`);
			const html = await response.text();
			const transition = document.createDocumentTransition();
			let image;
			let bg;
			transition.start(() => {
				updateTheDOMSomehow(html);
				const clickedLink = getLink(fromPath);
				image = clickedLink.querySelector('.product__img');
				image.classList.add('product-image');
				bg = clickedLink.querySelector('.product__bg');
				bg.classList.add('product-bg');
			}).then(() => {
				image.classList.remove('product-image');
				bg.classList.remove('product-bg');
			});
		}
		navigateEvent.transitionWhile(handler());
	}
});