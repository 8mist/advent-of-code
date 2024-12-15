import fs from "node:fs";

const testInput = fs.readFileSync(
	new URL("./input.test", import.meta.url),
	"utf-8",
);
export const testCase = [testInput, 2028];

const format = (input: string): string[] => {
	return input.replace(/\r/g, "").trim().split("\n\n");
};

const DIRECTIONS: Record<string, [number, number]> = {
	">": [0, 1],
	v: [1, 0],
	"<": [0, -1],
	"^": [-1, 0],
};

export const solve = (input: string) => {
	const [_map, _moves] = format(input);
	let start: [number, number] = [0, 0];

	const map: string[][] = _map.split("\n").map((row, i) =>
		row.split("").map((char, j) => {
			if (char === "@") {
				start = [i, j];
				return ".";
			}
			return char;
		}),
	);
	const moves: string[] = _moves.replaceAll("\n", "").split("");

	let current: [number, number] = start;

	for (const move of moves) {
		const [di, dj] = DIRECTIONS[move];
		const [i, j] = current;
		const [i2, j2] = [i + di, j + dj];

		if (map[i2][j2] === ".") {
			current = [i2, j2];
			continue;
		}
		if (map[i2][j2] === "O") {
			const queue: number[][] = [];
			let [i3, j3] = [i2, j2];

			while (map[i3][j3] === "O") {
				queue.push([i3, j3]);
				i3 += di;
				j3 += dj;
			}

			if (map[i3][j3] === ".") {
				current = [i2, j2];
				queue.sort(([ai, aj], [bi, bj]) =>
					di ? di * (bi - ai) : dj * (bj - aj),
				);

				for ([i3, j3] of queue) {
					map[i3 + di][j3 + dj] = "O";
					map[i3][j3] = ".";
				}
			}
		}
	}

	let sum = 0;
	for (let i = 0; i < map.length; i++) {
		for (let j = 0; j < map[0].length; j++) {
			if (map[i][j] === "O") {
				sum += 100 * i + j;
			}
		}
	}

	return sum;
};
