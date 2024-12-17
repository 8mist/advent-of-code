import fs from "node:fs";

const testInput = fs.readFileSync(
	new URL("./input.test", import.meta.url),
	"utf-8",
);
export const testCase = [testInput, 29328];

const format = (input: string): number[] => {
	return input.replace(/\r/g, "").trim().match(/\d+/g)!.map(Number);
};

const xor = (a: number, b: number) => {
	return Number(BigInt(a) ^ BigInt(b));
};

const resolveCombo = (registers: number[], operand: number): number => {
	const [a, b, c] = registers;
	switch (operand) {
		case 4:
			return a;
		case 5:
			return b;
		case 6:
			return c;
		case 7:
			throw new Error("7 is reserved");
		default:
			return operand;
	}
};

const INSTRUCTION = [
	// adv
	(registers: number[], operand: number, _output: number[]) => {
		const [a, _b, _c] = registers;
		registers[0] = Math.floor(a / 2 ** resolveCombo(registers, operand));
	},

	// bxl
	(registers: number[], operand: number, _output: number[]) => {
		const [_a, b, _c] = registers;
		registers[1] = xor(b, operand);
	},

	// bst
	(registers: number[], operand: number, _output) => {
		registers[1] = resolveCombo(registers, operand) % 8;
	},

	// jnz
	(registers: number[], operand: number, _output: number[]) => {
		const [a, _b, _c] = registers;
		return a === 0 ? undefined : operand;
	},

	// bxc
	(registers: number[], _operand: number, _output: number[]) => {
		const [_a, b, c] = registers;
		registers[1] = xor(b, c);
	},

	// out
	(registers: number[], operand: number, output: number[]) => {
		output.push(resolveCombo(registers, operand) % 8);
	},

	// bdv
	(registers: number[], operand: number, _output: number[]) => {
		const [a, _b, _c] = registers;
		registers[1] = Math.floor(a / 2 ** resolveCombo(registers, operand));
	},

	// cdv
	(registers: number[], operand: number, _output: number[]) => {
		const [a, _b, _c] = registers;
		registers[2] = Math.floor(a / 2 ** resolveCombo(registers, operand));
	},
];

function runProgram([a, b, c, program]) {
	const registers: number[] = [a, b, c];
	const output: number[] = [];
	let pointer = 0;
	while (pointer < program.length - 1) {
		const callback = INSTRUCTION[program[pointer]];
		pointer = callback(registers, program[pointer + 1], output) ?? pointer + 2;
	}
	return output;
}

export const solve = (input: string) => {
	const [_a, b, c, ...program] = format(input);
	let minA = Number.MAX_SAFE_INTEGER;

	const dfs = (depth = 0, a = 0) => {
		if (depth === program.length) {
			minA = Math.min(minA, a);
			return;
		}

		for (let i = 0; i < 8; i++) {
			const nextA = 8 * a + i;
			const output = runProgram([nextA, b, c, program]);
			if (output[0] === program.at(-1 - depth)) {
				dfs(depth + 1, nextA);
			}
		}
	};

	dfs();

	return minA;
};
