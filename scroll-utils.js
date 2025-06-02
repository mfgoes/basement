// scroll-utils.js

// Ease-in-out cubic function for smooth acceleration and deceleration
function easeInOutCubic(t, b, c, d) {
	t /= d / 2;
	if (t < 1) return (c / 2) * t * t * t + b;
	t -= 2;
	return (c / 2) * (t * t * t + 2) + b;
}

// Function to scroll to an element with slower speed, positioning it closer to the middle
function slowScrollToElement(element, wrapper) {
	const targetPosition = element.getBoundingClientRect().top + wrapper.scrollTop;
	const wrapperHeight = wrapper.clientHeight;
	const offset = wrapperHeight / 2 - element.clientHeight / 2; // Position the element in the middle

	const startPosition = wrapper.scrollTop;
	const distance = targetPosition - startPosition - offset;
	const duration = 1000; // Duration of the scroll in ms (increase for slower scroll)
	let startTime = null;

	// Smoothly scroll to the element
	function scrollStep(timestamp) {
		if (!startTime) startTime = timestamp;
		const progress = timestamp - startTime;
		const scrollAmount = easeInOutCubic(progress, startPosition, distance, duration);

		wrapper.scrollTo(0, scrollAmount);

		if (progress < duration) {
			window.requestAnimationFrame(scrollStep);
		}
	}

	window.requestAnimationFrame(scrollStep);
}

// Scroll to top functionality
function scrollToTop(wrapper) {
	wrapper.scrollTo({
		top: 0,
		behavior: 'smooth'
	});
}

// Toggle scroll button visibility
function toggleScrollButton(wrapper, button) {
	if (wrapper.scrollTop > 300) {
		button.classList.add('show');
	} else {
		button.classList.remove('show');
	}
}

export { slowScrollToElement, scrollToTop, toggleScrollButton };