import fs from "node:fs";

const testInput = fs.readFileSync(
	new URL("./input.test", import.meta.url),
	"utf-8",
);
export const testCase = [testInput, "co,de,ka,ta"];

const format = (input: string): string[] => {
	return input.replace(/\r/g, "").trim().split("\n");
};

const bronKerbosch = (
	graph: Record<string, Set<string>>,
	r: Set<string>,
	p: Set<string>,
	x: Set<string>,
	cliques: string[][],
) => {
	if (p.size === 0 && x.size === 0) {
		cliques.push([...r]);
		return;
	}

	const pCopy = new Set(p);
	for (const v of pCopy) {
		const neighbors = graph[v] || new Set();
		bronKerbosch(
			graph,
			new Set([...r, v]),
			new Set([...p].filter((u) => neighbors.has(u))),
			new Set([...x].filter((u) => neighbors.has(u))),
			cliques,
		);
		p.delete(v);
		x.add(v);
	}
};

export const solve = (input: string) => {
	const lines = format(input);
	const graph: Record<string, Set<string>> = {};

	for (const line of lines) {
		const [a, b] = line.split("-");
		if (!graph[a]) graph[a] = new Set();
		if (!graph[b]) graph[b] = new Set();
		graph[a].add(b);
		graph[b].add(a);
	}

	const cliques: string[][] = [];
	bronKerbosch(
		graph,
		new Set(),
		new Set(Object.keys(graph)),
		new Set(),
		cliques,
	);

	const largestClique: string[] = cliques.reduce((max, clique) => {
		return clique.length > max.length ? clique : max;
	}, []);

	return largestClique.sort().join(",");
};
