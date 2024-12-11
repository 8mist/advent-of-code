import fs from "node:fs";

const testInput = fs.readFileSync(
	new URL("./input.test", import.meta.url),
	"utf-8",
);
export const testCase = [testInput, 65601038650482];

const format = (input: string): number[] => {
	return input.replace(/\r/g, "").trim().split(" ").map(Number);
};

const memoizationCache = new Map<string, number>();

const transformStones = (stoneValue: number, steps: number) => {
	const key = `${stoneValue},${steps}`;
	if (memoizationCache.has(key)) {
		return memoizationCache.get(key)!;
	}

	let result: number;
	if (steps === 0) {
		result = 1;
	} else if (stoneValue === 0) {
		result = transformStones(1, steps - 1);
	} else if (stoneValue.toString().length % 2 === 0) {
		const dstr = stoneValue.toString();
		const mid = Math.floor(dstr.length / 2);
		const left = parseInt(dstr.slice(0, mid), 10);
		const right = parseInt(dstr.slice(mid), 10);
		result =
			transformStones(left, steps - 1) + transformStones(right, steps - 1);
	} else {
		result = transformStones(stoneValue * 2024, steps - 1);
	}

	memoizationCache.set(key, result);
	return result;
};

export const solve = (input: string) => {
	let stones = format(input);
	return stones.reduce((sum, x) => sum + transformStones(x, 75), 0);
};
