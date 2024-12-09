import fs from "node:fs";

const testInput = fs.readFileSync(
	new URL("./input.test", import.meta.url),
	"utf-8",
);
export const testCase = [testInput, 18];

const format = (input: string): string[] => {
	return input.replace(/\r/g, "").trim().split("\n");
};

const DIRS: [number, number][] = [
	[0, 1],
	[1, 1],
	[1, 0],
	[1, -1],
	[0, -1],
	[-1, -1],
	[-1, 0],
	[-1, 1],
];

const WORD = "XMAS";

const checkWordInDirection = (
	grid: string[],
	r: number,
	c: number,
	dir: [number, number],
): boolean => {
	for (let i = 0; i < WORD.length; i++) {
		const newRow = r + i * dir[0];
		const newCol = c + i * dir[1];
		if (
			newRow < 0 ||
			newRow >= grid.length ||
			newCol < 0 ||
			newCol >= grid[0].length ||
			grid[newRow][newCol] !== WORD[i]
		) {
			return false;
		}
	}
	return true;
};

export const solve = (input: string): number => {
	const grid = format(input);
	return grid
		.map((row, r) =>
			row
				.split("")
				.map(
					(_, c) =>
						DIRS.filter((dir) => checkWordInDirection(grid, r, c, dir)).length,
				)
				.reduce((acc, curr) => acc + curr, 0),
		)
		.reduce((acc, curr) => acc + curr, 0);
};
