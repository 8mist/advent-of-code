import fs from "node:fs";

const testInput = fs.readFileSync(
	new URL("./input.test", import.meta.url),
	"utf-8",
);
export const testCase = [testInput, 36];

const DIRECTIONS: number[][] = [
	[0, 1],
	[1, 0],
	[0, -1],
	[-1, 0],
];

const format = (input: string): number[][] => {
	return input
		.replace(/\r/g, "")
		.trim()
		.split("\n")
		.map((line) => line.split("").map(Number));
};

const findTrailheads = (map: number[][]): number[][] => {
	return map
		.flatMap((row, i) => row.map((cell, j) => (cell === 0 ? [i, j] : null)))
		.filter((trailhead): trailhead is number[] => trailhead !== null);
};

const calculateScore = (map: number[][], start: number[]): number => {
	const [i0, j0] = start;
	const seen = map.map((row) => row.map(() => 0));
	const queue: number[][] = [[i0, j0, -1]];
	let score = 0;

	while (queue.length !== 0) {
		const [i, j, h] = queue.pop()!;
		if (map[i]?.[j] !== h + 1 || seen[i][j] === 1) {
			continue;
		}
		seen[i][j] = 1;

		if (map[i][j] === 9) {
			score++;
		} else {
			queue.push(...DIRECTIONS.map(([di, dj]) => [i + di, j + dj, h + 1]));
		}
	}

	return score;
};

export const solve = (input: string) => {
	const map = format(input);
	const trailheads = findTrailheads(map);
	return trailheads.reduce(
		(sum, trailhead) => sum + calculateScore(map, trailhead),
		0,
	);
};
