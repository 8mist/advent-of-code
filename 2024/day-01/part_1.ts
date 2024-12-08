import fs from "node:fs";

const testInput = fs.readFileSync(
	new URL("./input.test", import.meta.url),
	"utf-8",
);
export const testCase = [testInput, 11];

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
	return left
		.sort((a, b) => a - b)
		.reduce(
			(total, value, index) =>
				total + Math.abs(value - right.sort((a, b) => a - b)[index]),
			0,
		);
};
