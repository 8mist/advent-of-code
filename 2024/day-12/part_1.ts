import fs from "node:fs";

const testInput = fs.readFileSync(
	new URL("./input.test", import.meta.url),
	"utf-8",
);
export const testCase = [testInput, 1930];

const format = (input: string): string[][] => {
	return input
		.replace(/\r/g, "")
		.trim()
		.split("\n")
		.map((line) => line.split(""));
};

const DIRECTIONS = [
	[0, 1],
	[1, 0],
	[0, -1],
	[-1, 0],
];

const DIRECTION_TO_INDEX = {
	0: { 1: 0, "-1": 2 },
	1: { 0: 1 },
	"-1": { 0: 3 },
};

export const solve = (input: string) => {
	const grid = format(input);
	const perimeters = grid.map((row) => row.map(() => Array(4).fill(1)));
	const visited = grid.map((row) => row.map(() => 0));

	let sum = 0;

	for (let row = 0; row < grid.length; row++) {
		for (let col = 0; col < grid[0].length; col++) {
			if (visited[row][col] === 1) continue;

			const currentChar = grid[row][col];
			const queue = [[row, col]];
			const regionCells: number[][] = [];

			while (queue.length > 0) {
				const [currentRow, currentCol, prevRow, prevCol] = queue.pop()!;

				if (grid[currentRow]?.[currentCol] !== currentChar) continue;

				if (perimeters[prevRow]?.[prevCol] !== undefined) {
					const [rowDiff, colDiff] = [
						currentRow - prevRow,
						currentCol - prevCol,
					];
					perimeters[prevRow][prevCol][DIRECTION_TO_INDEX[rowDiff][colDiff]] =
						0;
				}

				if (visited[currentRow][currentCol] === 1) continue;

				visited[currentRow][currentCol] = 1;
				regionCells.push([currentRow, currentCol]);

				queue.push(
					...DIRECTIONS.map(([rowOffset, colOffset]) => [
						currentRow + rowOffset,
						currentCol + colOffset,
						currentRow,
						currentCol,
					]),
				);
			}

			let regionPerimeter = 0;
			for (const [cellRow, cellCol] of regionCells) {
				regionPerimeter += perimeters[cellRow][cellCol].reduce(
					(sum, value) => sum + value,
					0,
				);
			}

			sum += regionCells.length * regionPerimeter;
		}
	}

	return sum;
};
