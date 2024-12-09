import fs from "node:fs";

const testInput = fs.readFileSync(
	new URL("./input.test", import.meta.url),
	"utf-8",
);
export const testCase = [testInput, 9];

const format = (input: string): string[] => {
	return input.replace(/\r/g, "").trim().split("\n");
};

const FLIP = {
	M: "S",
	S: "M",
};

const DIRECTIONS: [number, number][] = [
	[1, 1],
	[1, -1],
];

const checkCross = (grid: string[], r: number, c: number): number => {
	if (grid[r][c] !== "A") {
		return 0;
	}

	let validCrossCount = 0;

	for (const [di, dj] of DIRECTIONS) {
		const newRow1 = r + di;
		const newCol1 = c + dj;
		const newRow2 = r - di;
		const newCol2 = c - dj;

		if (
			newRow1 >= 0 &&
			newRow1 < grid.length &&
			newCol1 >= 0 &&
			newCol1 < grid[0].length &&
			newRow2 >= 0 &&
			newRow2 < grid.length &&
			newCol2 >= 0 &&
			newCol2 < grid[0].length
		) {
			const char1 = grid[newRow1][newCol1];
			const char2 = grid[newRow2][newCol2];
			if ((char1 === FLIP.M || char1 === FLIP.S) && char2 === FLIP[char1]) {
				validCrossCount++;
			}
		}
	}

	return validCrossCount === DIRECTIONS.length ? 1 : 0;
};

export const solve = (input: string): number => {
	const grid = format(input);

	return grid
		.map((row, r) =>
			row
				.split("")
				.map((_, c) => checkCross(grid, r, c))
				.reduce((acc, curr) => acc + curr, 0),
		)
		.reduce((acc, curr) => acc + curr, 0);
};
