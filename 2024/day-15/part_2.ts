import fs from "node:fs";

const testInput = fs.readFileSync(
	new URL("./input.test", import.meta.url),
	"utf-8",
);
export const testCase = [testInput, 1751];

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
		row.split("").flatMap((char, j) => {
			if (char === "@") {
				start = [i, j * 2];
				return "..".split("");
			}
			if (char === "O") {
				return "[]".split("");
			}
			return [char, char];
		}),
	);
	const moves: string[] = _moves.replaceAll("\n", "").split("");

	let current: [number, number] = start;

	for (const move of moves) {
		const [di, dj] = DIRECTIONS[move];
		const [i, j] = current;
		let [i2, j2] = [i + di, j + dj];

		outer: {
			if (map[i2][j2] === ".") {
				current = [i2, j2];
				break outer;
			}
			if (map[i2][j2] === "[" || map[i2][j2] === "]") {
				if (di === 0) {
					let [i3, j3] = [i2, j2];

					while ("[]".includes(map[i3][j3])) {
						j3 += dj;
					}

					if (map[i3][j3] === ".") {
						current = [i2, j2];
						let prev = map[i2][j2];
						map[i2][j2] = ".";

						while (i2 !== i3 || j2 !== j3) {
							i2 += di;
							j2 += dj;
							[prev, map[i2][j2]] = [map[i2][j2], prev];
						}
					}
				} else {
					const start = [
						[i2, j2],
						map[i2][j2] === "[" ? [i2, j + 1] : [i2, j - 1],
					];
					let frontier = [...start];

					while (frontier.some(([i3, j3]) => "[]".includes(map[i3][j3]))) {
						const nextFrontier: number[][] = [];
						for (let [i3, j3] of frontier) {
							if (map[i3][j3] === ".") continue;

							i3 += di;

							if (map[i3][j3] === "#") {
								break outer;
							}
							if (map[i3][j3] === ".") {
								nextFrontier.push([i3, j3]);
								continue;
							}
							if (map[i3][j3] === "[") {
								nextFrontier.push([i3, j3], [i3, j3 + 1]);
								continue;
							}
							if (map[i3][j3] === "]") {
								nextFrontier.push([i3, j3], [i3, j3 - 1]);
							}
						}
						frontier = nextFrontier;
					}

					current = [i2, j2];
					let frontier2: [number, number, string][] = start.map(([i3, j3]) => [
						i3,
						j3,
						map[i3][j3],
					]);
					for (const [i3, j3] of frontier2) {
						map[i3][j3] = ".";
					}
					while (frontier2.length !== 0) {
						const nextFrontier2: [number, number, string][] = [];
						for (let [i3, j3, char] of frontier2) {
							i3 += di;
							if (map[i3][j3] === ".") {
								map[i3][j3] = char;
							} else if (map[i3][j3] === "[") {
								nextFrontier2.push([i3, j3, "["], [i3, j3 + 1, "]"]);
								map[i3][j3] = char;
								map[i3][j3 + 1] = ".";
							} else if (map[i3][j3] === "]") {
								nextFrontier2.push([i3, j3, "]"], [i3, j3 - 1, "["]);
								map[i3][j3] = char;
								map[i3][j3 - 1] = ".";
							}
						}
						frontier2 = nextFrontier2;
					}
				}
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
	}

	let sum = 0;
	for (let i = 0; i < map.length; i++) {
		for (let j = 0; j < map[0].length; j++) {
			if (map[i][j] === "[") {
				sum += 100 * i + j;
			}
		}
	}

	return sum;
};
