import fs from "node:fs";

const testInput = fs.readFileSync(
	new URL("./input.test", import.meta.url),
	"utf-8",
);
export const testCase = [testInput, 1928];

const format = (input: string): string => {
	return input.replace(/\r/g, "").trim();
};

const generateBlocks = (diskMap: string): number[] => {
	return [...diskMap].flatMap((countChar, i) =>
		Array(+countChar).fill(i % 2 === 0 ? i / 2 : -1),
	);
};

const findNextIndices = (
	blocks: number[],
	left: number,
	right: number,
): { left: number; right: number } => {
	left = blocks.findIndex((block, idx) => block === -1 && idx > left);
	right = blocks.findLastIndex((block, idx) => block !== -1 && idx < right);
	return { left, right };
};

const swapBlocks = (blocks: number[], left: number, right: number): void => {
	[blocks[left], blocks[right]] = [blocks[right], blocks[left]];
};

export const solve = (input: string) => {
	const diskMap = format(input);

	const blocks: number[] = generateBlocks(diskMap);

	let left = blocks.findIndex((block) => block === -1);
	let right = blocks.findLastIndex((block) => block !== -1);

	while (left !== -1 && right !== -1 && left < right) {
		swapBlocks(blocks, left, right);
		const indices = findNextIndices(blocks, left, right);
		left = indices.left;
		right = indices.right;
	}

	return blocks.reduce((acc, n, i) => acc + i * Math.max(0, n), 0);
};
