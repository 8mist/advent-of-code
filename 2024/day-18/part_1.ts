import fs from "node:fs";

// const testInput = fs.readFileSync(
// 	new URL("./input.test", import.meta.url),
// 	"utf-8",
// );
// export const testCase = [testInput, 22];
const testInput = fs.readFileSync(new URL("./input", import.meta.url), "utf-8");
export const testCase = [testInput, 280];

const format = (input: string): number[][] => {
	return input
		.replace(/\r/g, "")
		.trimEnd()
		.split("\n")
		.map((line) => line.split(",").map(Number));
};

const DIRECTIONS: number[][] = [
	[-1, 0],
	[1, 0],
	[0, -1],
	[0, 1],
];
const GRID_SIZE = 71;
const BYTES_COUNT = 1024;
// const GRID_SIZE = 7;
// const BYTES_COUNT = 12;

export const solve = (input: string) => {
	const bytes = format(input);

	const calculateMinSteps = (bytesCount: number) => {
		const grid = Array.from({ length: GRID_SIZE }, () =>
			Array.from({ length: GRID_SIZE }).fill(1),
		);

		for (let i = 0; i < bytesCount; i++) {
			const [x, y] = bytes[i];
			grid[y][x] = 0;
		}

		let queue: number[][] = [[0, 0, 0]];
		const minSteps = grid.map((row) => row.map(() => Number.MAX_SAFE_INTEGER));

		while (queue.length > 0) {
			const nextQueue: number[][] = [];
			for (const [x, y, steps] of queue) {
				if (!grid[y]?.[x] || steps >= minSteps[y][x]) {
					continue;
				}
				minSteps[y][x] = steps;
				nextQueue.push(
					...DIRECTIONS.map(([dx, dy]) => [x + dx, y + dy, steps + 1]),
				);
			}
			queue = nextQueue;
		}

		return minSteps[GRID_SIZE - 1][GRID_SIZE - 1];
	};

	return calculateMinSteps(BYTES_COUNT);
};