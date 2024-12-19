import fs from "node:fs";

const testInput = fs.readFileSync(
	new URL("./input.test", import.meta.url),
	"utf-8",
);
export const testCase = [testInput, 6];

const format = (input: string): string[] => {
	return input.replace(/\r/g, "").trim().split("\n");
};

type Memo = { [key: string]: boolean };

const canConstruct = (design: string, patterns: string[], memo: Memo = {}) => {
	if (design === "") {
		return true;
	}

	if (memo[design] !== undefined) {
		return memo[design];
	}

	for (const pattern of patterns) {
		if (design.startsWith(pattern)) {
			const remaining = design.slice(pattern.length);
			if (canConstruct(remaining, patterns, memo)) {
				memo[design] = true;
				return true;
			}
		}
	}

	memo[design] = false;
	return false;
};

export const solve = (input: string) => {
	const lines = format(input);
	const patterns = lines[0].split(", ").map((p) => p.trim());
	const designs = lines.slice(2).map((d) => d.trim());

	let possibleCount = 0;

	for (const design of designs) {
		if (canConstruct(design, patterns)) {
			possibleCount++;
		}
	}

	return possibleCount;
};
