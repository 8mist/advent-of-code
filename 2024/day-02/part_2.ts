import fs from "node:fs";

const testInput = fs.readFileSync(
	new URL("./input.test", import.meta.url),
	"utf-8",
);
export const testCase = [testInput, 4];

const format = (input: string): Array<Array<number>> => {
	return input
		.replace(/\r/g, "")
		.trim()
		.split("\n")
		.map((line) => line.trim().split(/\s+/).map(Number));
};

const isSafeReport = (report: Array<number>): boolean => {
	let isSafe = true;
	let isIncreasing: boolean | undefined = undefined;

	for (let i = 0; i < report.length - 1; i++) {
		const delta = report[i + 1] - report[i];

		if (Math.abs(delta) > 3 || delta === 0) {
			isSafe = false;
			break;
		}

		if (isIncreasing === undefined) {
			isIncreasing = delta > 0;
		} else if ((isIncreasing && delta < 0) || (!isIncreasing && delta > 0)) {
			isSafe = false;
			break;
		}
	}

	return isSafe;
};

const isSafeAfterRemoval = (report: number[]): boolean => {
	for (let i = 0; i < report.length; i++) {
		const modifiedReport = [...report.slice(0, i), ...report.slice(i + 1)];
		if (isSafeReport(modifiedReport)) {
			return true;
		}
	}
	return false;
};

export const solve = (input: string) => {
	const reports = format(input);
	return reports.filter(
		(report) => isSafeReport(report) || isSafeAfterRemoval(report),
	).length;
};
