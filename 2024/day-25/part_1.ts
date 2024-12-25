import fs from "node:fs";

const testInput = fs.readFileSync(
	new URL("./input.test", import.meta.url),
	"utf-8",
);
export const testCase = [testInput, 3];

const format = (input: string): string[] => {
	return input.replace(/\r/g, "").trim().split("\n\n");
};

const computeHeights = (block: string[]) =>
	block[0]
		.split("")
		.map((_, i) =>
			block.reduce((count, line) => count + (line[i] === "#" ? 1 : 0), -1),
		);

export const solve = (input: string) => {
	const blocks = format(input);
	const locks: number[][] = [];
	const keys: number[][] = [];

	for (const rawBlock of blocks) {
		const block = rawBlock.split("\n");
		const heights = computeHeights(block);

		if (block[0] === "#####") {
			locks.push(heights);
		} else {
			keys.push(heights);
		}
	}

	return locks.reduce(
		(total, lock) =>
			total +
			keys.filter((key) => lock.every((l, i) => l + key[i] <= lock.length))
				.length,
		0,
	);
};
