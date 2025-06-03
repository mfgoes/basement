// csv-loader.js
async function loadCSV() {
	try {
		const response = await fetch("groupchats.csv");
		const text = await response.text();
		const rows = text.split("\n").slice(1); // Skip header row

		const data = rows
			.map(row => row.split(","))
			.filter(columns => columns.length === 2 && columns[0] && columns[1]) // Ensure both name and date exist
			.map(columns => ({
				name: columns[0].trim(),
				date: columns[1].trim()
			}));

		return data;
	} catch (error) {
		console.error("Error loading CSV:", error);
		return [];
	}
}

export { loadCSV };