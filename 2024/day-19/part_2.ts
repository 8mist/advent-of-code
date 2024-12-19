import fs from "node:fs";

const testInput = fs.readFileSync(
	new URL("./input.test", import.meta.url),
	"utf-8",
);
export const testCase = [testInput, 16];

const format = (input: string): string[] => {
	return input.replace(/\r/g, "").trim().split("\n");
};

type Memo = { [key: string]: number };

const countWays = (
	design: string,
	patterns: string[],
	memo: Memo = {},
): number => {
	if (design === "") {
		return 1;
	}
	if (memo[design] !== undefined) {
		return memo[design];
	}

	let totalWays = 0;

	for (const pattern of patterns) {
		if (design.startsWith(pattern)) {
			const remaining = design.slice(pattern.length);
			totalWays += countWays(remaining, patterns, memo);
		}
	}

	memo[design] = totalWays;
	return totalWays;
};

export const solve = (input: string) => {
	const lines = format(input);
	const patterns = lines[0].split(", ").map((p) => p.trim());
	const designs = lines.slice(2).map((d) => d.trim());

	let totalCombinations = 0;

	for (const design of designs) {
		totalCombinations += countWays(design, patterns);
	}

	return totalCombinations;
};
