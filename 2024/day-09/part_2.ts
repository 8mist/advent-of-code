import fs from "node:fs";

const testInput = fs.readFileSync(
	new URL("./input.test", import.meta.url),
	"utf-8",
);
export const testCase = [testInput, 2858];

const format = (input: string): string => {
	return input.replace(/\r/g, "").trim();
};

const generateBlocksAndSizes = (
	diskMap: string,
): { blocks: number[]; sizes: number[] } => {
	const blocks: number[] = [];
	const sizes: number[] = [];

	for (let i = 0; i < diskMap.length; i++) {
		const n = +diskMap[i];
		for (let j = 0; j < n; j++) {
			blocks.push(i % 2 === 0 ? i / 2 : -1);
			sizes.push(n);
		}
	}

	return { blocks, sizes };
};

const swapBlocks = (
	blocks: number[],
	sizes: number[],
	left: number,
	right: number,
	rSize: number,
): { left: number; right: number } => {
	for (let i = 0; i < rSize; i++) {
		[blocks[left], blocks[right]] = [blocks[right], blocks[left]];
		[sizes[left], sizes[right]] = [sizes[right], sizes[left]];
		left++;
		right--;
	}

	return { left, right };
};

const adjustLeftBlockSize = (
	sizes: number[],
	left: number,
	rSize: number,
	lSize: number,
): number => {
	for (let i = 0; i < lSize - rSize; i++) {
		sizes[left] -= rSize;
		left++;
	}
	return left;
};

const findValidIndices = (
	blocks: number[],
	sizes: number[],
	right: number,
): { left: number; right: number } => {
	let left = blocks.findIndex(
		(n, i) => n === -1 && i < right && sizes[i] >= sizes[right],
	);

	while (left === -1) {
		right = blocks.findLastIndex(
			(n, i) => n !== -1 && i <= right - sizes[right],
		);
		left = blocks.findIndex(
			(n, i) => n === -1 && i < right && sizes[i] >= sizes[right],
		);
		if (right === -1) {
			return { left: -1, right: -1 };
		}
	}

	return { left, right };
};

export const solve = (input: string) => {
	const diskMap = format(input);

	const { blocks, sizes } = generateBlocksAndSizes(diskMap);

	let right = blocks.findLastIndex((n) => n !== -1);
	let left = blocks.findIndex((n, i) => n === -1 && sizes[i] >= sizes[right]);

	outer: while (true) {
		const rSize = sizes[right];
		const lSize = sizes[left];

		const updatedIndices = swapBlocks(blocks, sizes, left, right, rSize);
		left = updatedIndices.left;
		right = updatedIndices.right;

		left = adjustLeftBlockSize(sizes, left, rSize, lSize);

		const indices = findValidIndices(blocks, sizes, right);
		left = indices.left;
		right = indices.right;
		if (right === -1) {
			break outer;
		}
	}

	return blocks.reduce((acc, n, i) => acc + i * Math.max(0, n), 0);
};
