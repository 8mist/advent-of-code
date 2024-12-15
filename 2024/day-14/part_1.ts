import fs from "node:fs";

const testInput = fs.readFileSync(
	new URL("./input.test", import.meta.url),
	"utf-8",
);
export const testCase = [testInput, 208437768];

const format = (input: string): number[][] => {
	return input
		.replace(/\r/g, "")
		.trim()
		.split("\n")
		.map((line) => line.match(/-?\d+/g)!.map(Number));
};

const TILES_WIDE = 101;
const TILES_TALL = 103;

const mod = (a: number, b: number): number => {
	return a < 0 ? b - (-a % b) : a % b;
};

export const solve = (input: string) => {
	const robots = format(input);
	let time = 0;

	while (time < 100) {
		time++;
		for (const robot of robots) {
			const [px, py, vx, vy] = robot;
			robot[0] = mod(px + vx, TILES_WIDE);
			robot[1] = mod(py + vy, TILES_TALL);
		}
	}

	const quadrantCounts = [
		[0, 0],
		[0, 0],
	];

	for (const [px, py] of robots) {
		const xQuadrant =
			px < TILES_WIDE / 2 - 1 ? 0 : px > TILES_WIDE / 2 ? 1 : -1;
		const yQuadrant =
			py < TILES_TALL / 2 - 1 ? 0 : py > TILES_TALL / 2 ? 1 : -1;

		if (xQuadrant !== -1 && yQuadrant !== -1) {
			quadrantCounts[xQuadrant][yQuadrant]++;
		}
	}

	return quadrantCounts.flat().reduce((acc, n) => acc * n, 1);
};
