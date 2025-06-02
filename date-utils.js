// date-utils.js - Utilities for date formatting and calculations
export function getRelativeTime(dateString) {
	const date = new Date(dateString);
	const now = new Date();
	const diffInMs = now.getTime() - date.getTime();
	const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
	const diffInMonths = Math.floor(diffInDays / 30);
	const diffInYears = Math.floor(diffInDays / 365);

	if (diffInDays === 0) {
		return "Today";
	} else if (diffInDays === 1) {
		return "Yesterday";
	} else if (diffInDays < 7) {
		return `${diffInDays} days ago`;
	} else if (diffInDays < 30) {
		const weeks = Math.floor(diffInDays / 7);
		return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
	} else if (diffInMonths < 12) {
		return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
	} else {
		return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
	}
}

export function formatDate(dateString) {
	const date = new Date(dateString);
	return date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	});
}

export function getYearFromDate(dateString) {
	const date = new Date(dateString);
	return date.getFullYear();
}

export function getMonthYear(dateString) {
	const date = new Date(dateString);
	return date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long'
	});
}