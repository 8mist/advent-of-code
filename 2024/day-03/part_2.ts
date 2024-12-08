import fs from "node:fs";

const testInput = fs.readFileSync(
	new URL("./input.test", import.meta.url),
	"utf-8",
);
export const testCase = [testInput, 48];

const dontDoRegex = /don\'t\(\).*?do\(\)/gs;
const mulRegex = /mul\((\d{1,3}),\s*(\d{1,3})\)/g;

const format = (input: string): RegExpExecArray[] => {
	return Array.from(
		input.replace(/\r/g, "").trim().replace(dontDoRegex, "").matchAll(mulRegex),
	);
};

export const solve = (input: string) => {
	const matches = format(input);
	return matches.reduce(
		(sum, match) =>
			sum + Number.parseInt(match[1], 10) * Number.parseInt(match[2], 10),
		0,
	);
};
