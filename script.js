// script.js - Back to original approach with optimizations
import { loadCSV } from './csv-loader.js';
import { TimelineRenderer } from './timeline-renderer.js';
import { scrollToTop, toggleScrollButton } from './scroll-utils.js';
import { QuarterNavigator } from './quarter-navigator.js';

class GroupChatTimeline {
	constructor() {
		this.timelineContainer = document.getElementById("timeline-container");
		this.timelineWrapper = document.getElementById("timeline-wrapper");
		this.scrollToTopBtn = document.getElementById("scroll-to-top");
		
		this.renderer = new TimelineRenderer(this.timelineContainer, this.timelineWrapper);
		this.quarterNavigator = null;
		
		this.init();
	}

	async init() {
		await this.loadData();
		this.setupEventListeners();
		this.renderer.render();
		
		// Apply performance optimizations for large datasets
		this.renderer.optimizeForLargeDataset();
	}

	async loadData() {
		const data = await loadCSV();
		this.renderer.setData(data);
		
		// Create quarter navigator after data is loaded
		this.quarterNavigator = new QuarterNavigator(data, (index) => {
			this.renderer.setSelectedIndex(index);
			this.renderer.updateSelection();
		});
		
		// Add navigation button to header
		this.addNavigationButton();
	}

	addNavigationButton() {
		const header = document.getElementById('header');
		const navButton = document.createElement('button');
		navButton.id = 'nav-button';
		navButton.innerHTML = '📊';
		navButton.title = 'Toggle Quarter Filter (Ctrl+F)';
		navButton.addEventListener('click', () => {
			this.quarterNavigator.toggle();
		});
		header.appendChild(navButton);
	}

	handleScroll(e) {
		const currentIndex = this.renderer.getSelectedIndex();
		const dataLength = this.renderer.getDataLength();
		
		if (e.deltaY > 0 || e.key === "ArrowDown") {
			this.renderer.setSelectedIndex(currentIndex + 1);
		} else if (e.deltaY < 0 || e.key === "ArrowUp") {
			this.renderer.setSelectedIndex(currentIndex - 1);
		}

		// Use the optimized update method instead of full render
		setTimeout(() => {
			this.renderer.updateSelection();
			// Update quarter navigator highlight
			if (this.quarterNavigator) {
				this.quarterNavigator.highlightCurrentQuarter(this.renderer.getSelectedIndex());
			}
		}, 10);
	}

	setupEventListeners() {
		// Scroll and keyboard navigation
		window.addEventListener("wheel", (e) => this.handleScroll(e));
		window.addEventListener("keydown", (e) => {
			// Handle Ctrl+F or Cmd+F for quick navigation
			if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
				e.preventDefault();
				this.quarterNavigator.toggle();
			} else {
				this.handleScroll(e);
			}
		});
		
		// Scroll to top button
		this.scrollToTopBtn.addEventListener('click', () => {
			scrollToTop(this.timelineWrapper);
		});
		
		// Toggle scroll button visibility with throttling for performance
		let scrollTimeout;
		this.timelineWrapper.addEventListener('scroll', () => {
			if (scrollTimeout) {
				clearTimeout(scrollTimeout);
			}
			scrollTimeout = setTimeout(() => {
				toggleScrollButton(this.timelineWrapper, this.scrollToTopBtn);
			}, 16); // ~60fps
		});
	}
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
	new GroupChatTimeline();
});