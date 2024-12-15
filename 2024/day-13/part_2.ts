import fs from "node:fs";

const testInput = fs.readFileSync(
	new URL("./input.test", import.meta.url),
	"utf-8",
);
export const testCase = [testInput, 875318608908];

const format = (input: string): number[][] => {
	return input
		.replace(/\r/g, "")
		.trim()
		.split("\n\n")
		.map((machine: string) => {
			const m = machine.match(/\d+/g)!.map(Number);
			m[4] += 10000000000000;
			m[5] += 10000000000000;
			return m;
		});
};

export const solve = (input: string) => {
	const machines = format(input);
	let sum = 0;
	for (const [dx1, dy1, dx2, dy2, x, y] of machines) {
		const a = (x * dy2 - y * dx2) / (dx1 * dy2 - dx2 * dy1);
		if (Number.isInteger(a)) {
			const xRemain = x - dx1 * a;
			const b = xRemain / dx2;
			if (Number.isInteger(b) && dy1 * a + dy2 * b === y) {
				sum += a * 3 + b;
			}
		}
	}
	return sum;
};
