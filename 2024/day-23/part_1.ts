import fs from "node:fs";

const testInput = fs.readFileSync(
	new URL("./input.test", import.meta.url),
	"utf-8",
);
export const testCase = [testInput, 7];

const format = (input: string): string[] => {
	return input.replace(/\r/g, "").trim().split("\n");
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

	let triangles = 0;

	for (const node1 in graph) {
		for (const node2 of graph[node1]) {
			if (node2 > node1) {
				for (const node3 of graph[node2]) {
					if (node3 > node2 && graph[node3].has(node1)) {
						if ([node1, node2, node3].some((name) => name.startsWith("t"))) {
							triangles++;
						}
					}
				}
			}
		}
	}

	return triangles;
};
