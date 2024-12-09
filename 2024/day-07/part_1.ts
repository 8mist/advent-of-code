import fs from "node:fs";

const testInput = fs.readFileSync(
	new URL("./input.test", import.meta.url),
	"utf-8",
);
export const testCase = [testInput, 3749];

type Equation = {
  target: number;
  numbers: number[];
};

const format = (input: string): Equation[] => {
	return input
		.replace(/\r/g, "")
		.trim()
		.split("\n")
		.map((line) => {
			const [target, numbers] = line.split(": ");
			return {
				target: parseInt(target),
				numbers: numbers.split(" ").map(Number),
			};
		});
};

const evaluateLeftToRight = (numbers: number[], operators: string[]): number => {
	let result = numbers[0];
	for (let i = 0; i < operators.length; i++) {
		if (operators[i] === "+") {
			result += numbers[i + 1];
		} else if (operators[i] === "*") {
			result *= numbers[i + 1];
		}
	}
	return result;
}

const generateOperatorsCombinations = (n: number): string[][] => {
	if (n === 0) return [[]];
	const smallerCombos = generateOperatorsCombinations(n - 1);
	return smallerCombos.flatMap((combo) => [
		combo.concat("+"),
		combo.concat("*"),
	]);
}

export const solve = (input: string) => {
	const equations = format(input);

	let totalCalibrationResult = 0;

	for (const { target, numbers } of equations) {
		const operatorPositions = numbers.length - 1;
		const operatorCombos = generateOperatorsCombinations(operatorPositions);
		const isValid = operatorCombos.some(
			(operators) => evaluateLeftToRight(numbers, operators) === target,
		);
		if (isValid) {
			totalCalibrationResult += target;
		}
	}

	return totalCalibrationResult;
};
