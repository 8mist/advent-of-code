import fs from "node:fs";
import * as $C from "js-combinatorics";

const testInput = fs.readFileSync(
	new URL("./input.test", import.meta.url),
	"utf-8",
);
export const testCase = [testInput, 126384];

const format = (input: string): string[] => {
	return input.replace(/\r/g, "").trim().split("\n");
};

type Coordinate = [number, number];
type Keypad = string[][];
type DirectionalMapping = { [key: string]: Coordinate };

const NUMERIC_KEYPAD = [
	["7", "8", "9"],
	["4", "5", "6"],
	["1", "2", "3"],
	["", "0", "A"],
];

const NUMERIC_TO_COORDS: DirectionalMapping = NUMERIC_KEYPAD.reduce(
	(mapping, row, rowIndex) => {
		for (let colIndex = 0; colIndex < row.length; colIndex++) {
			mapping[row[colIndex]] = [rowIndex, colIndex];
		}
		return mapping;
	},
	{} as DirectionalMapping,
);

const DIRECTIONS: { [key: string]: Coordinate } = {
	">": [0, 1],
	v: [1, 0],
	"<": [0, -1],
	"^": [-1, 0],
};

const DIRECTIONAL_KEYPAD = [
	["", "^", "A"],
	["<", "v", ">"],
];

const DIRECTIONAL_TO_COORDS: DirectionalMapping = DIRECTIONAL_KEYPAD.reduce(
	(mapping, row, rowIndex) => {
		for (let colIndex = 0; colIndex < row.length; colIndex++) {
			mapping[row[colIndex]] = [rowIndex, colIndex];
		}
		return mapping;
	},
	{} as DirectionalMapping,
);

function calculateMoves(
	start: Coordinate,
	end: Coordinate,
	keypad: Keypad,
): string[] {
	const [startRow, startCol] = start;
	const [endRow, endCol] = end;
	const [deltaRow, deltaCol] = [endRow - startRow, endCol - startCol];

	let moves = "";
	moves += deltaRow >= 0 ? "v".repeat(deltaRow) : "^".repeat(-deltaRow);
	moves += deltaCol >= 0 ? ">".repeat(deltaCol) : "<".repeat(-deltaCol);

	const permutations = Array.from(new $C.Permutation(moves));

	const validMoves = permutations.filter((perm) => {
		let [currentRow, currentCol] = start;
		for (const move of perm) {
			const [moveRow, moveCol] = DIRECTIONS[move];
			[currentRow, currentCol] = [currentRow + moveRow, currentCol + moveCol];
			if (keypad[currentRow][currentCol] === "") {
				return false;
			}
		}
		return true;
	});

	return validMoves.map((perm) => `${perm.join("")}A`);
}

function calculatePresses(
	code: string,
	depthLimit: number,
	depth = 0,
	memo: { [key: string]: number } = {},
): number {
	const memoKey = `${code},${depth}`;
	if (memo[memoKey] !== undefined) {
		return memo[memoKey];
	}

	let keypad: Keypad;
	let currentPosition: Coordinate;
	let coordsMapping: DirectionalMapping;

	if (depth === 0) {
		keypad = NUMERIC_KEYPAD;
		currentPosition = [3, 2];
		coordsMapping = NUMERIC_TO_COORDS;
	} else {
		keypad = DIRECTIONAL_KEYPAD;
		currentPosition = [0, 2];
		coordsMapping = DIRECTIONAL_TO_COORDS;
	}

	let totalMoves = 0;
	for (const character of code) {
		const targetPosition = coordsMapping[character];
		const possibleMoves = calculateMoves(
			currentPosition,
			targetPosition,
			keypad,
		);

		if (depth === depthLimit) {
			totalMoves += possibleMoves[0].length;
		} else {
			totalMoves += Math.min(
				...possibleMoves.map((move) =>
					calculatePresses(move, depthLimit, depth + 1, memo),
				),
			);
		}

		currentPosition = targetPosition;
	}

	memo[memoKey] = totalMoves;
	return totalMoves;
}

export const solve = (input: string) => {
	const codes = format(input);
	const depthLimit = 2;
	let totalComplexity = 0;

	for (const code of codes) {
		const moveCount = calculatePresses(code, depthLimit);
		const numericValue = Number.parseInt(code.match(/\d+/)?.[0] || "0", 10);
		totalComplexity += moveCount * numericValue;
	}

	return totalComplexity;
};
