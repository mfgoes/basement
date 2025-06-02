// csv-combiner.js
import Papa from 'papaparse';

async function combineCSVData() {
	try {
		// Load and parse groupchats.csv (name, date format)
		const groupchatsData = await window.fs.readFile('groupchats.csv', { encoding: 'utf8' });
		const groupchatsLines = groupchatsData.split('\n').slice(1).filter(line => line.trim());
		
		const groupchatsRecords = groupchatsLines.map(line => {
			const parsed = Papa.parse(line, { header: false, skipEmptyLines: true });
			if (parsed.data[0] && parsed.data[0].length >= 2) {
				return {
					name: parsed.data[0][0].replace(/"/g, ''),
					date: parsed.data[0][1],
					source: 'groupchats',
					changedBy: null,
					oldName: null
				};
			}
			return null;
		}).filter(record => record !== null);

		// Load and parse group_name_changes.csv 
		const nameChangesData = await window.fs.readFile('group_name_changes.csv', { encoding: 'utf8' });
		const parsedNameChanges = Papa.parse(nameChangesData, {
			header: true,
			dynamicTyping: true,
			skipEmptyLines: true
		});

		const nameChangeRecords = parsedNameChanges.data.map(row => ({
			name: row['New Name'],
			date: row['Change Date'],
			source: 'name_changes',
			changedBy: row['Changed By'],
			oldName: row['Old Name'] || null
		}));

		// Combine all records
		const combinedData = [...groupchatsRecords, ...nameChangeRecords];

		// Sort by date
		combinedData.sort((a, b) => new Date(a.date) - new Date(b.date));

		return combinedData;

	} catch (error) {
		console.error("Error combining CSV data:", error);
		return [];
	}
}

// Option 2: Create a timeline view
async function createTimeline() {
	const combinedData = await combineCSVData();
	
	// Group by date and show what happened each day
	const timeline = {};
	
	combinedData.forEach(record => {
		if (!timeline[record.date]) {
			timeline[record.date] = [];
		}
		timeline[record.date].push(record);
	});

	return timeline;
}

// Option 3: Deduplicate and merge overlapping data
async function createMergedDataset() {
	const combinedData = await combineCSVData();
	
	// Create a map to track unique name-date combinations
	const uniqueRecords = new Map();
	
	combinedData.forEach(record => {
		const key = `${record.name}_${record.date}`;
		
		if (!uniqueRecords.has(key)) {
			uniqueRecords.set(key, record);
		} else {
			// If we have a duplicate, prefer the one with more information (from name_changes)
			const existing = uniqueRecords.get(key);
			if (record.source === 'name_changes' && existing.source === 'groupchats') {
				uniqueRecords.set(key, { ...existing, ...record });
			}
		}
	});

	return Array.from(uniqueRecords.values()).sort((a, b) => new Date(a.date) - new Date(b.date));
}

// Export functions
export { combineCSVData, createTimeline, createMergedDataset };