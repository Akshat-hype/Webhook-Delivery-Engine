const csv = `date,rep_name,region,product,units,unit_price
2026-01-05,Aarav,North,Laptop,10,50000
2026-01-08,Diya,South,Phone,25,20000
2026-01-12,Kabir,East,Tablet,18,15000
2026-01-15,Meera,West,Monitor,12,12000
2026-01-20,Aarav,North,Phone,30,20000
2026-01-23,Diya,South,Laptop,8,50000
2026-02-03,Kabir,East,Phone,22,20000
2026-02-07,Meera,West,Tablet,16,15000
2026-02-10,Aarav,North,Monitor,14,12000
2026-02-14,Diya,South,Phone,35,20000
2026-02-18,Kabir,East,Laptop,9,50000
2026-02-22,Meera,West,Phone,28,20000
2026-03-02,Aarav,North,Laptop,11,50000
2026-03-06,Diya,South,Tablet,20,15000
2026-03-10,Kabir,East,Monitor,15,12000
2026-03-14,Meera,West,Phone,32,20000
2026-03-18,Aarav,North,Tablet,17,15000
2026-03-22,Diya,South,Laptop,7,50000
2026-03-25,Kabir,East,Phone,26,20000
2026-03-28,Meera,West,Monitor,13,12000
2026-04-02,Aarav,North,Phone,24,20000
2026-04-06,Diya,South,Monitor,10,12000
2026-04-10,Kabir,East,Laptop,6,50000
2026-04-14,Meera,West,Tablet,19,15000
2026-04-18,Aarav,North,Monitor,16,12000
2026-04-22,Diya,South,Phone,,
2026-04-24,Kabir,East,Phone,-5,20000
2026-04-26,Meera,West,Laptop,8
not-a-date,Aarav,North,Phone,12,20000
2026-04-29,Diya,South,Tablet,14,15000`;

console.log("CSV dataset loaded.");

function parseCSV(text) {
    const lines = text.trim().split(/\r?\n/);

    const headers = lines[0]
    .split(",")
    .map(header => header.trim());

    const rows = lines.slice(1).map((line, index) => {
        const values = line.split(",").map(value => value.trim());

        const record = {};

        headers.forEach((header, columnIndex) => {
              record[header] = values[columnIndex] ?? "";
        });

        return {
              rowNumber: index + 2,
                record,
                  columnCount: values.length};

        });

        return { headers, rows };
    }

    const parsed = parseCSV(csv);

    console.log("Headers:", parsed.headers);
    console.log("Total records:", parsed.rows.length);


function validateRow(entry, headers) {
    const { record, columnCount } = entry;

    if (columnCount !== headers.length) {
        return "Incorrect number of columns";
    }

    for (const header of headers) {
        if (!record[header]) {
            return "Missing field: ${header}";
        }
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(record.date)) {
        return "Malformed date (expected YYYY-MM-DD)";
    }

    const parsedDate = new Date("${record.date}T00:00:00Z");

    if (
        Number.isNaN(parsedDate.getTime()) ||
        parsedDate.toISOString().slice(0, 10) !== record.date) {
            return "Invalid calendar date";
            }

            if (!Number.isFinite(Number(record.units))) {
                return "Units must be numeric";
            }

            if (Number(record.units) < 0) {
                return "Units cannot be negative";
            }

            if (
                !Number.isFinite(Number(record.unit_price)) ||
                Number(record.unit_price) < 0
            ) {
                return "Unit price must be a non-negative number";
            }

            return null;
}

const { headers, rows } = parseCSV(csv);

const validRows = [];
const errors = [];

for (const entry of rows) {
    const reason = validateRow(entry, headers);

    if (reason) {
        errors.push({
            row: entry.rowNumber,
            reason,
            data: JSON.stringify(entry.record)
        });
    } else {
        validRows.push({
            ...entry.record,
            units: Number(entry.record.units),
            unit_price: Number(entry.record.unit_price)
        });
    }
}

console.log("\nValid records:", validRows.length);
console.log("Rejected records:", errors.length);

console.table(errors);

const regionRevenue = {};

for (const row of validRows) {
    const revenue = row.units * row.unit_price;

    regionRevenue[row.region] =
    (regionRevenue[row.region] || 0) + revenue;
}

const revenueTable = Object.entries(regionRevenue)
.map(([region, revenue]) => ({
    region,
    totalRevenue: revenue.toFixed(2)
}))
.sort((a, b) =>
    Number(b.totalRevenue) - Number(a.totalRevenue)
);

console.log("\nTOTAL REVENUE BY REGION");
console.table(revenueTable);

const repUnits = {};

for (const row of validRows) {
    repUnits[row.rep_name] =
    (repUnits[row.rep_name] || 0) + row.units;
}

const repTable = Object.entries(repUnits)
.map(([rep_name, units]) => ({
    rep_name,
    units}))
    .sort((a, b) => b.units - a.units);

    console.log("\nUNITS SOLD BY REPRESENTATIVE");
    console.table(repTable);

    if (repTable.length > 0) {
        console.log(
            "Top representative: ${repTable[0].rep_name} " +
            "(${repTable[0].units} units)"
        );
    }
const monthlyUnits = {};

for (const row of validRows) {
    const month = row.date.slice(0, 7);

    monthlyUnits[month] =
    (monthlyUnits[month] || 0) + row.units;
}

const months = Object.keys(monthlyUnits).sort();

const growthTable = months.map((month, index) => {
    const units = monthlyUnits[month];
const previousMonth = months[index - 1];

if (!previousMonth) {
    return {
        month,
    units,
previousMonthUnits: "-",
growthPercent: "N/A (baseline)"
};
}

const previousUnits = monthlyUnits[previousMonth];

const growth =
((units - previousUnits) / previousUnits) * 100;

return {
    month,
units,
previousMonthUnits: previousUnits,
growthPercent: "${growth.toFixed(2)}%"
};
});

console.log("\nMONTH-OVER-MONTH UNIT GROWTH");
console.table(growthTable);
console.log("\n========== FINAL SUMMARY ==========");
console.log("Total input records:", rows.length);
console.log("Valid records:", validRows.length);
console.log("Rejected records:", errors.length);