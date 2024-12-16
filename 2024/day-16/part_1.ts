import fs from "node:fs";

const testInput = fs.readFileSync(
	new URL("./input.test", import.meta.url),
	"utf-8",
);
export const testCase = [testInput, 7036];

const format = (input: string): string[] => {
	return input.replace(/\r/g, "").trim().split("\n");
};

type Direction = [number, number];
type Path = [number, number][];

interface QueueItem {
	i: number;
	j: number;
	dirIdx: number;
	score: number;
	path: Path;
}

const DIRECTIONS: Direction[] = [
	[0, 1],
	[1, 0],
	[0, -1],
	[-1, 0],
];

export const solve = (input: string) => {
	const lines = format(input);

	let start: [number, number] = [-1, -1];

	const map = lines.map((line, i) =>
		line.split("").map((char, j) => {
			if (char === "S") start = [i, j];
			return char;
		}),
	);

	let queue: QueueItem[] = [
		{ i: start[0], j: start[1], dirIdx: 0, score: 0, path: [start] },
	];

	const paths: Record<number, Path[]> = {};
	const seen = map.map((row) =>
		row.map(() => DIRECTIONS.map(() => Number.MAX_SAFE_INTEGER)),
	);
	let minScore = Number.MAX_SAFE_INTEGER;

	while (queue.length > 0) {
		const nextQueue: QueueItem[] = [];

		for (const { i, j, dirIdx, score, path } of queue) {
			if (score > minScore) continue;

			if (map[i][j] === "E") {
				minScore = Math.min(minScore, score);
				if (score === minScore) {
					paths[minScore] = paths[minScore] || [];
					paths[minScore].push(path);
				}
				continue;
			}

			if (seen[i][j][dirIdx] < score) continue;
			seen[i][j][dirIdx] = score;

			for (let dirIdx2 = 0; dirIdx2 < 4; dirIdx2++) {
				if (dirIdx2 === (dirIdx + 2) % 4) continue;

				const [di, dj] = DIRECTIONS[dirIdx2];
				const i2 = i + di;
				const j2 = j + dj;

				if (".E".includes(map[i2]?.[j2])) {
					nextQueue.push({
						i: i2,
						j: j2,
						dirIdx: dirIdx2,
						score: score + 1 + (dirIdx2 !== dirIdx ? 1000 : 0),
						path: [...path, [i2, j2]],
					});
				}
			}
		}

		queue = nextQueue;
	}

	return minScore;
};
