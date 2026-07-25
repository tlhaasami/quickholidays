const fs = require("fs");
const path = require("path");

const csvPath = "C:\\Users\\talha\\Downloads\\trustpilot (2).csv";
const outputPath = path.join(__dirname, "../src/data/reviews.json");

// Simple CSV parser that handles quotes and newlines correctly
function parseCSV(content) {
  const rows = [];
  let row = [""];
  let insideQuote = false;

  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    const nextChar = content[i + 1];

    if (char === '"') {
      if (insideQuote && nextChar === '"') {
        // Escaped double quote
        row[row.length - 1] += '"';
        i++;
      } else {
        // Toggle quote state
        insideQuote = !insideQuote;
      }
    } else if (char === ',' && !insideQuote) {
      row.push("");
    } else if ((char === '\r' || char === '\n') && !insideQuote) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      rows.push(row);
      row = [""];
    } else {
      row[row.length - 1] += char;
    }
  }
  if (row.length > 1 || row[0] !== "") {
    rows.push(row);
  }
  return rows;
}

const countries = [
  "France", "Spain", "Germany", "Italy", "Switzerland", "Austria", "Belgium", "Portugal", "Netherlands", "Greece", "Iceland"
];

function extractCountry(title, text) {
  const combined = `${title} ${text}`.toLowerCase();
  for (const c of countries) {
    if (combined.includes(c.toLowerCase())) {
      return `${c} Visa`;
    }
  }
  return "Schengen Visa";
}

try {
  console.log(`Reading CSV from: ${csvPath}`);
  const content = fs.readFileSync(csvPath, "utf-8");
  const parsedRows = parseCSV(content);

  // Filter out header row and empty rows
  const reviews = [];
  
  // Row 0 is header, so start from index 1
  for (let i = 1; i < parsedRows.length; i++) {
    const row = parsedRows[i];
    if (row.length < 6) continue;
    
    const name = row[0]?.trim();
    const title = row[3]?.trim();
    const text = row[4]?.trim();
    const date = row[5]?.trim();
    
    // Skip if name or text is empty
    if (!name || !text) continue;
    
    const country = extractCountry(title, text);
    
    reviews.push({
      name,
      rating: 5,
      title,
      text,
      date,
      country
    });
  }

  console.log(`Successfully parsed ${reviews.length} reviews.`);
  
  // Create src/data directory if it doesn't exist
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(outputPath, JSON.stringify(reviews, null, 2), "utf-8");
  console.log(`Saved reviews JSON to: ${outputPath}`);
  process.exit(0);
} catch (err) {
  console.error("Failed to parse reviews CSV:", err);
  process.exit(1);
}
