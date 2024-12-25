import fs from "node:fs";

const testInput = fs.readFileSync(
	new URL("./input.test", import.meta.url),
	"utf-8",
);
export const testCase = [testInput, 2024];

const format = (input: string): string[] => {
	return input.replace(/\r/g, "").trim().split("\n\n");
};

type GateType = "AND" | "OR" | "XOR";

const logic: Record<GateType, (a: string, b: string) => string> = {
	AND: (a: string, b: string) => {
		if (a === "0" || b === "0") return "0";
		return "1";
	},
	OR: (a: string, b: string) => {
		if (a === "0" && b === "0") return "0";
		return "1";
	},
	XOR: (a: string, b: string) => {
		if (a === b) return "0";
		return "1";
	},
};

export const solve = (input: string) => {
	const [wiresRaw, gatesRaw] = format(input);
	const wires = new Map(
		wiresRaw
			.split("\n")
			.map((line) => line.split(":").map((v) => v.trim())) as [
			string,
			string,
		][],
	);

	const gates = gatesRaw
		.split("\n")
		.map((line) => line.split(" "))
		.map(([a, gate, b, _, output]) => ({
			a,
			b,
			gate: gate as GateType,
			output,
		}));

	while (gates.length > 0) {
		const gate = gates.shift()!;
		const { a, b, output, gate: gateType } = gate;
		const valueA = wires.get(a);
		const valueB = wires.get(b);

		if (valueA === undefined || valueB === undefined) {
			gates.push(gate);
			continue;
		}

		const result = logic[gateType](valueA, valueB);
		wires.set(output, result);
	}

	const sorted = [...wires.entries()]
		.filter(([key]) => key[0] === "z")
		.map(([key, value]) => [key, Number(value)] as [string, number])
		.sort(([keyA], [keyB]) => (keyA as string).localeCompare(keyB as string));

	const binary = sorted
		.map(([_, bit]) => bit)
		.reverse()
		.join("");

	return Number.parseInt(binary, 2);
};
