import fs from "node:fs";

const testInput = fs.readFileSync(
	new URL("./input.test", import.meta.url),
	"utf-8",
);
export const testCase = [testInput, 20];

const format = (input: string): string[] => {
	return input.replace(/\r/g, "").trim().split("\n");
};

const nextSecretNumber = (_secret: number): number => {
	const MODULO = 16777216;
	let secret = _secret;

	// Step 1: Multiply by 64, mix, prune
	const step1 = (secret * 64) % MODULO;
	secret ^= step1;
	secret %= MODULO;

	// Step 2: Divide by 32 (floor it), mix, prune
	const step2 = Math.floor(secret / 32) % MODULO;
	secret ^= step2;
	secret %= MODULO;

	// Step 3: Multiply by 2048, mix, prune
	const step3 = (secret * 2048) % MODULO;
	secret ^= step3;
	secret %= MODULO;

	return secret;
};

const generatePriceChangePatterns = (
	initialSecret: number,
): Record<string, number> => {
	const priceChanges: number[] = [];
	const priceMap: Record<string, number> = {};
	let secret = initialSecret;
	let currentPrice = secret % 10;
	let previousPrice = currentPrice;

	for (let i = 0; i < 2000; i++) {
		secret = nextSecretNumber(secret);
		currentPrice = secret % 10;
		priceChanges.push(currentPrice - previousPrice);
		previousPrice = currentPrice;

		if (priceChanges.length >= 4) {
			const patternKey = priceChanges.slice(-4).join();
			priceMap[patternKey] ??= currentPrice;
		}
	}

	return priceMap;
};

const identifyOptimalPatterns = (
	lines: string[],
	priceMaps: Record<string, Record<string, number>>,
): Set<string> => {
	const optimalPatterns = new Set<string>();

	for (const line of lines) {
		for (const [pattern, price] of Object.entries(priceMaps[line])) {
			if (price === 9) {
				optimalPatterns.add(pattern);
			}
		}
	}

	return optimalPatterns;
};

const calculateMaximumBananas = (
	lines: string[],
	optimalPatterns: Set<string>,
	priceMaps: Record<string, Record<string, number>>,
): number => {
	let maximumBananas = 0;
	for (const pattern of optimalPatterns) {
		let totalBananas = 0;
		for (const line of lines) {
			totalBananas += priceMaps[line][pattern] ?? 0;
		}
		maximumBananas = Math.max(maximumBananas, totalBananas);
	}
	return maximumBananas;
};

export const solve = (input: string) => {
	const lines = format(input);
	const priceMaps: Record<string, Record<string, number>> = {};

	for (const line of lines) {
		priceMaps[line] = generatePriceChangePatterns(+line);
	}

	const optimalPatterns = identifyOptimalPatterns(lines, priceMaps);
	return calculateMaximumBananas(lines, optimalPatterns, priceMaps);
};
