import fs from "node:fs";

const testInput = fs.readFileSync(
	new URL("./input.test", import.meta.url),
	"utf-8",
);
export const testCase = [testInput, 34];

const format = (input: string): string[] => {
	return input.replace(/\r/g, "").trim().split("\n");
};

type Antenna = { x: number; y: number };

const extractAntennas = (lines: string[]): Record<string, Antenna[]> => {
	return lines.reduce((antennas, line, y) => {
		for (const [x, char] of [...line].entries()) {
			if (char !== ".") {
				if (!antennas[char]) antennas[char] = [];
				antennas[char].push({ x, y });
			}
		}
		return antennas;
	}, {});
};

const calculateAntinodes = (
	antennas: Record<string, Antenna[]>,
	lines: string[],
): number => {
	const antinodes = lines.map(() =>
		Array.from({ length: lines[0].length }).fill(0),
	);

	for (const coords of Object.values(antennas)) {
		for (let i = 0; i < coords.length - 1; i++) {
			const { x, y } = coords[i];
			for (let j = i + 1; j < coords.length; j++) {
				const { x: x2, y: y2 } = coords[j];
				const dy = y2 - y;
				const dx = x2 - x;

				for (let [y3, x3, dir] of [
					[y2, x2, 1],
					[y, x, -1],
				]) {
					while (antinodes[y3]?.[x3] !== undefined) {
						antinodes[y3][x3] = 1;
						y3 += dy * dir;
						x3 += dx * dir;
					}
				}
			}
		}
	}

	return antinodes.flat().filter((cell) => cell === 1).length;
};

export const solve = (input: string): number => {
	const lines: string[] = format(input);
	const antennas: Record<string, Antenna[]> = extractAntennas(lines);
	return calculateAntinodes(antennas, lines);
};
