import fs from "node:fs";

const testInput = fs.readFileSync(
	new URL("./input.test", import.meta.url),
	"utf-8",
);
export const testCase = [testInput, 143];

const format = (input: string): string[] => {
	return input.replace(/\r/g, "").trim().split("\n\n");
};

const buildMap = (rules: string): Record<number, Record<number, number>> =>
	rules
		.split("\n")
		.map((rule) => rule.split("|").map(Number))
		.reduce(
			(map, [left, right]) => {
				(map[left] ??= {})[right] = -1;
				return map;
			},
			{} as Record<number, Record<number, number>>,
		);

const sortPages = (
	pages: number[],
	map: Record<number, Record<number, number>>,
): number[] => [...pages].toSorted((a, b) => map[a]?.[b] ?? 0);

const isPagesSorted = (pages: number[], sortedPages: number[]): boolean =>
	pages.every((page, i) => page === sortedPages[i]);

const getMiddlePage = (pages: number[]): number =>
	pages[(pages.length - 1) / 2];

export const solve = (input: string) => {
	const [rules, updates] = format(input);
	const map = buildMap(rules);

	return updates
		.split("\n")
		.map((update) => update.split(",").map(Number))
		.reduce((sum, pages) => {
			const sortedPages = sortPages(pages, map);
			return isPagesSorted(pages, sortedPages)
				? sum + getMiddlePage(pages)
				: sum;
		}, 0);
};
