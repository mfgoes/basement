// timeline-renderer.js - Back to original approach with performance optimizations
import { changeBackgroundColor } from './background-change.js';
import { slowScrollToElement } from './scroll-utils.js';

class TimelineRenderer {
	constructor(container, wrapper) {
		this.container = container;
		this.wrapper = wrapper;
		this.data = [];
		this.selectedIndex = 0;
		this.hoverIndex = -1;
		this.renderedElements = []; // Cache DOM elements for performance
	}

	setData(data) {
		this.data = data;
		this.renderedElements = []; // Clear cache when data changes
	}

	setSelectedIndex(index) {
		this.selectedIndex = Math.max(0, Math.min(index, this.data.length - 1));
	}

	getSelectedIndex() {
		return this.selectedIndex;
	}

	getDataLength() {
		return this.data.length;
	}

	createGroupChatElement(item, index) {
		const groupchatElement = document.createElement("div");
		groupchatElement.classList.add("groupchat");
		groupchatElement.textContent = item.name;
		
		// Store reference for easy updates
		groupchatElement.setAttribute('data-index', index);

		// Add hover event listeners
		groupchatElement.addEventListener('mouseenter', () => {
			if (index !== this.selectedIndex) {
				this.hoverIndex = index;
				groupchatElement.style.color = '#555';
				groupchatElement.style.transform = 'scale(1.05)';
				groupchatElement.style.backgroundColor = 'rgba(102, 126, 234, 0.1)';
			}
		});

		groupchatElement.addEventListener('mouseleave', () => {
			if (index !== this.selectedIndex) {
				this.hoverIndex = -1;
				groupchatElement.style.color = '#888';
				groupchatElement.style.transform = 'scale(1)';
				groupchatElement.style.backgroundColor = 'transparent';
			}
		});

		// Add click functionality
		groupchatElement.addEventListener('click', () => {
			this.selectedIndex = index;
			this.updateSelection();
		});

		return groupchatElement;
	}

	// Optimized method to update only selection states without full re-render
	updateSelection() {
		// Remove previous selection
		const previousSelected = this.container.querySelector('.groupchat.selected');
		if (previousSelected) {
			previousSelected.classList.remove('selected');
			previousSelected.style.backgroundColor = 'transparent';
			// Remove date if it exists
			const dateElement = previousSelected.querySelector('.date');
			if (dateElement) {
				dateElement.remove();
			}
		}

		// Add new selection
		const newSelected = this.container.querySelector(`[data-index="${this.selectedIndex}"]`);
		if (newSelected) {
			newSelected.classList.add('selected');
			changeBackgroundColor(newSelected);
			
			// Add date to selected item
			const dateElement = document.createElement("div");
			dateElement.classList.add("date");
			dateElement.textContent = this.data[this.selectedIndex].date;
			newSelected.appendChild(dateElement);

			// Scroll to the selected element
			slowScrollToElement(newSelected, this.wrapper);
		}
	}

	// Initial render - creates all elements once
	render() {
		// Only do full render if elements don't exist
		if (this.renderedElements.length === 0) {
			this.container.innerHTML = "";
			
			// Create all elements once and cache them
			this.data.forEach((item, index) => {
				const groupchatElement = this.createGroupChatElement(item, index);
				this.container.appendChild(groupchatElement);
				this.renderedElements.push(groupchatElement);
			});
		}

		// Update selection state
		this.updateSelection();
	}

	// Method to handle performance optimization for large lists
	optimizeForLargeDataset() {
		if (this.data.length > 50) {
			// Add CSS optimizations for large datasets
			this.container.style.willChange = 'transform';
			this.wrapper.style.contain = 'layout style paint';
			
			// Use transform instead of scroll for better performance
			this.container.style.transform = 'translateZ(0)'; // Force hardware acceleration
		}
	}
}

export { TimelineRenderer };