// quarter-navigator.js - Simple quarter-based navigation with side panel
import { getYearFromDate } from './date-utils.js';

export class QuarterNavigator {
	constructor(data, onNavigate) {
		this.data = data;
		this.onNavigate = onNavigate;
		this.quarterGroups = this.groupDataByQuarter();
		this.isVisible = false;
		this.createElement();
		this.setupEventListeners();
	}

	getQuarter(dateString) {
		const date = new Date(dateString);
		const month = date.getMonth() + 1; // 1-12
		const year = date.getFullYear();
		const quarter = Math.ceil(month / 3);
		return {
			quarter,
			year,
			label: `Q${quarter} ${year}`,
			sortKey: year * 10 + quarter // For sorting: 20241, 20242, etc.
		};
	}

	groupDataByQuarter() {
		const groups = {};
		this.data.forEach((item, index) => {
			const quarterInfo = this.getQuarter(item.date);
			const key = quarterInfo.label;
			
			if (!groups[key]) {
				groups[key] = {
					...quarterInfo,
					items: [],
					firstIndex: index
				};
			}
			groups[key].items.push({ ...item, index });
			
			// Keep track of the earliest item for navigation
			if (index < groups[key].firstIndex) {
				groups[key].firstIndex = index;
			}
		});
		return groups;
	}

	createElement() {
		// Create side panel
		this.container = document.createElement('div');
		this.container.id = 'quarter-navigator';
		this.container.innerHTML = `
			<div class="navigator-header">
				<h3>📅 Quick Jump</h3>
				<button class="toggle-btn" title="Toggle Filter">‹</button>
			</div>
			<div class="navigator-content">
				<div class="quarter-list"></div>
			</div>
		`;

		// Add to body
		document.body.appendChild(this.container);

		// Populate quarters
		this.populateQuarters();
	}

	populateQuarters() {
		const quarterList = this.container.querySelector('.quarter-list');
		const quarters = Object.values(this.quarterGroups)
			.sort((a, b) => b.sortKey - a.sortKey); // Most recent first

		quarterList.innerHTML = quarters.map(quarter => {
			const count = quarter.items.length;
			return `
				<div class="quarter-item" data-index="${quarter.firstIndex}" data-quarter="${quarter.label}">
					<div class="quarter-label">${quarter.label}</div>
					<div class="quarter-count">${count} chat${count !== 1 ? 's' : ''}</div>
				</div>
			`;
		}).join('');

		// Add "All" option at the top
		quarterList.insertAdjacentHTML('afterbegin', `
			<div class="quarter-item all-item" data-index="0">
				<div class="quarter-label">📋 All Chats</div>
				<div class="quarter-count">${this.data.length} total</div>
			</div>
		`);
	}

	setupEventListeners() {
		// Toggle button
		this.container.querySelector('.toggle-btn').addEventListener('click', () => {
			this.toggle();
		});

		// Quarter navigation
		this.container.addEventListener('click', (e) => {
			const quarterItem = e.target.closest('.quarter-item');
			if (quarterItem) {
				// Remove previous selection
				this.container.querySelectorAll('.quarter-item').forEach(item => {
					item.classList.remove('active');
				});
				
				// Add selection to clicked item
				quarterItem.classList.add('active');
				
				const index = parseInt(quarterItem.dataset.index);
				this.onNavigate(index);
			}
		});

		// Keyboard shortcut
		document.addEventListener('keydown', (e) => {
			if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
				e.preventDefault();
				this.toggle();
			}
		});
	}

	show() {
		this.container.classList.add('visible');
		this.isVisible = true;
		
		// Adjust main timeline layout
		const timelineWrapper = document.getElementById('timeline-wrapper');
		timelineWrapper.classList.add('with-navigator');
	}

	hide() {
		this.container.classList.remove('visible');
		this.isVisible = false;
		
		// Restore main timeline layout
		const timelineWrapper = document.getElementById('timeline-wrapper');
		timelineWrapper.classList.remove('with-navigator');
	}

	toggle() {
		if (this.isVisible) {
			this.hide();
		} else {
			this.show();
		}
	}

	// Highlight the quarter that contains the current selection
	highlightCurrentQuarter(selectedIndex) {
		const selectedItem = this.data[selectedIndex];
		if (!selectedItem) return;

		const currentQuarter = this.getQuarter(selectedItem.date);
		
		// Remove previous highlights
		this.container.querySelectorAll('.quarter-item').forEach(item => {
			item.classList.remove('current');
		});

		// Add highlight to current quarter
		const currentQuarterElement = this.container.querySelector(`[data-quarter="${currentQuarter.label}"]`);
		if (currentQuarterElement) {
			currentQuarterElement.classList.add('current');
		}
	}
}