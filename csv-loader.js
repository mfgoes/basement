// csv-loader.js - Simple version for merged_groupchats.csv
async function loadCSV() {
	try {
		const response = await fetch("merged_groupchats.csv");
		const text = await response.text();
		const rows = text.split("\n").slice(1); // Skip header row

		const data = rows
			.map(row => {
				// Simple CSV parsing - handle quoted fields
				const columns = parseCSVRow(row);
				return columns;
			})
			.filter(columns => columns.length >= 3 && columns[0] && columns[1]) // Ensure name and date exist
			.map(columns => ({
				name: columns[0].trim().replace(/^"|"$/g, ''), // Remove quotes
				date: columns[1].trim(),
				source: columns[2] ? columns[2].trim() : '',
				changedBy: columns[3] ? columns[3].trim() : '',
				oldName: columns[4] ? columns[4].trim() : ''
			}))
			.sort((a, b) => new Date(b.date) - new Date(a.date)); // Most recent first

		return data;
	} catch (error) {
		console.error("Error loading CSV:", error);
		return [];
	}
}

// Simple CSV parsing
function parseCSVRow(row) {
	const result = [];
	let current = '';
	let inQuotes = false;
	
	for (let i = 0; i < row.length; i++) {
		const char = row[i];
		
		if (char === '"') {
			inQuotes = !inQuotes;
		} else if (char === ',' && !inQuotes) {
			result.push(current);
			current = '';
		} else {
			current += char;
		}
	}
	
	result.push(current);
	return result;
}

export { loadCSV };