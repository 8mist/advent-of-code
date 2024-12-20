import fs from "node:fs";

const testInput = fs.readFileSync(new URL("./input", import.meta.url), "utf-8");
export const testCase = [testInput, 1521];

const format = (input: string): string[] => {
	return input.replace(/\r/g, "").trim().split("\n");
};

type Grid = (0 | 1)[][];
type Position = [number, number];

const DIRECTIONS: Position[] = [
	[0, 1],
	[1, 0],
	[0, -1],
	[-1, 0],
];
const MIN_TIME_SAVE = 100;
const MAX_DISTANCE_CHEAT = 2;

export const solve = (input: string) => {
	const lines = format(input);

	let startPosition: Position | null = null;
	const trackGrid: Grid = lines.map((line, i) =>
		line.split("").map((char, j) => {
			if (char === "S") {
				startPosition = [i, j];
			}
			return char === "#" ? 0 : 1; // Convert to 0 (wall) or 1 (track)
		}),
	);

	if (!startPosition) {
		return -1;
	}

	const maxTrackLength = trackGrid.flat().filter(Boolean).length - 1;
	const timeGrid: number[][] = trackGrid.map(() =>
		trackGrid[0].map(() => Number.MAX_SAFE_INTEGER),
	);
	let currentPosition: Position = startPosition;
	let timeRemaining: number = maxTrackLength;

	while (timeRemaining >= 0) {
		const [row, col] = currentPosition;
		timeGrid[row][col] = timeRemaining;
		timeRemaining--;
		for (const [rowDelta, colDelta] of DIRECTIONS) {
			const newRow = row + rowDelta;
			const newCol = col + colDelta;
			if (
				trackGrid[newRow]?.[newCol] &&
				timeGrid[newRow][newCol] === Number.MAX_SAFE_INTEGER
			) {
				currentPosition = [newRow, newCol];
				break;
			}
		}
	}

	const possibleCheats: Record<number, number> = {};

	for (let row = 0; row < trackGrid.length; row++) {
		for (let col = 0; col < trackGrid[row].length; col++) {
			if (trackGrid[row][col] === 0) continue;

			const currentTime = timeGrid[row][col];
			for (
				let cheatRow = row - MAX_DISTANCE_CHEAT;
				cheatRow <= row + MAX_DISTANCE_CHEAT;
				cheatRow++
			) {
				const rowDelta = Math.abs(cheatRow - row);
				for (
					let cheatCol = col - (MAX_DISTANCE_CHEAT - rowDelta);
					cheatCol <= col + (MAX_DISTANCE_CHEAT - rowDelta);
					cheatCol++
				) {
					const colDelta = Math.abs(cheatCol - col);
					const distance = rowDelta + colDelta;
					const targetTime =
						timeGrid[cheatRow]?.[cheatCol] ?? Number.MAX_SAFE_INTEGER;
					const timeSaved = currentTime - targetTime - distance;
					if (timeSaved > 0) {
						possibleCheats[timeSaved] = (possibleCheats[timeSaved] ?? 0) + 1;
					}
				}
			}
		}
	}

	const totalCheatsSavingAtLeastMinimumTime = Object.entries(possibleCheats)
		.filter(([timeSaved]) => Number(timeSaved) >= MIN_TIME_SAVE)
		.map(([, cheatCount]) => cheatCount)
		.reduce((total, cheatCount) => total + cheatCount, 0);

	return totalCheatsSavingAtLeastMinimumTime;
};
