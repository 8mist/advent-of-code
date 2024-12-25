import fs from "node:fs";

const testInput = fs.readFileSync(
	new URL("./input.test", import.meta.url),
	"utf-8",
);
export const testCase = [
	testInput,
	"ffh,hwm,kjc,mjb,ntg,rvg,tgd,wpb,z02,z03,z05,z06,z07,z08,z10,z11",
];

const format = (input: string): string[] => {
	return input.replace(/\r/g, "").trim().split("\n\n");
};

type Gate = {
	a: string;
	b: string;
	gate: GateType;
	output: string;
};
type GateType = "AND" | "OR" | "XOR";

const isSus = (gates: Gate[]): Set<string> => {
	const sus = new Set<string>();
	const highestZ = "z45";

	for (const { a, gate, b, output } of gates) {
		if (output.startsWith("z") && gate !== "XOR" && output !== highestZ) {
			sus.add(output);
		}

		if (
			gate === "XOR" &&
			!["x", "y", "z"].includes(output[0]) &&
			!["x", "y", "z"].includes(a[0]) &&
			!["x", "y", "z"].includes(b[0])
		) {
			sus.add(output);
		}

		if (gate === "AND" && a !== "x00" && b !== "x00") {
			for (const { a: subA, gate: subGate, b: subB } of gates) {
				if ((output === subA || output === subB) && subGate !== "OR") {
					sus.add(output);
				}
			}
		}

		if (gate === "XOR") {
			for (const { a: subA, gate: subGate, b: subB } of gates) {
				if ((output === subA || output === subB) && subGate === "OR") {
					sus.add(output);
				}
			}
		}
	}

	return sus;
};

export function solve(input) {
	const [_wiresRaw, gatesRaw] = format(input);

	const gates = gatesRaw
		.split("\n")
		.map((line) => line.split(" "))
		.map(([a, gate, b, _, output]) => ({
			a,
			b,
			gate: gate as GateType,
			output,
		}));

	return [...isSus(gates).values()].sort().join(",");
}
