import fs from "node:fs";

const testInput = fs.readFileSync(
	new URL("./input.test", import.meta.url),
	"utf-8",
);
export const testCase = [testInput, 6];

const format = (input: string): string[] => {
	return input.replace(/\r/g, "").trim().split("\n");
};

const mod = (n: number, m: number) => ((n % m) + m) % m;

export const solve = (input: string) => {
	const instructions = format(input);

	let position = 50;
	let zeroCount = 0;

	for (const instruction of instructions) {
		const [, direction, distanceStr] = instruction.match(/([LR])(\d+)/)!;
		const distance = Number(distanceStr);
		const delta = direction === "L" ? -1 : 1;

		for (let i = 1; i <= distance; i++) {
			const intermediatePos = mod(position + delta * i, 100);
			if (intermediatePos === 0) {
				zeroCount++;
			}
		}

		position = mod(position + delta * distance, 100);
	}

	return zeroCount;
};
