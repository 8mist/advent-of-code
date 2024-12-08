import fs from "node:fs";

const testInput = fs.readFileSync(
	new URL("./input.test", import.meta.url),
	"utf-8",
);
export const testCase = [testInput, 31];

const format = (input: string): [number[], number[]] => {
	const lines = input.replace(/\r/g, "").trim().split("\n");
	const left: number[] = [];
	const right: number[] = [];

	for (const line of lines) {
		const [before, after] = line.split(/\s+/).map(Number);
		left.push(before);
		right.push(after);
	}

	return [left, right];
};

export const solve = (input: string) => {
	const [left, right] = format(input);

	const rightCounts = right.reduce<Record<number, number>>((counts, num) => {
		counts[num] = (counts[num] || 0) + 1;
		return counts;
	}, {});

	return left.reduce((total, num) => total + (rightCounts[num] || 0) * num, 0);
};
