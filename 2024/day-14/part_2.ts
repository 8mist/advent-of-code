import fs from "node:fs";

const testInput = fs.readFileSync(
	new URL("./input.test", import.meta.url),
	"utf-8",
);
export const testCase = [testInput, 7492];

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
	const map = Array.from({ length: TILES_TALL }).map(() =>
		Array.from({ length: TILES_WIDE }).map(() => 0),
	);

	let time = 0;
	while (true) {
		time++;
		for (const robot of robots) {
			const [px, py, vx, vy] = robot;
			robot[0] = mod(px + vx, TILES_WIDE);
			robot[1] = mod(py + vy, TILES_TALL);
		}

		for (const [px, py] of robots) {
			map[py][px] = 1;
		}
		if (map.flat().join("").includes("11111111")) {
			break;
		}
		for (const [px, py] of robots) {
			map[py][px] = 0;
		}
	}

	return time;
};
