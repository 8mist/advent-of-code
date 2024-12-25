import fs from "node:fs";

const testInput = fs.readFileSync(
	new URL("./input.test", import.meta.url),
	"utf-8",
);
export const testCase = [testInput, 37327623];

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

const find2000thSecret = (initialSecret: number): number => {
	let secret = initialSecret;
	for (let i = 0; i < 2000; i++) {
		secret = nextSecretNumber(secret);
	}
	return secret;
};

export const solve = (input: string) => {
	const lines = format(input);
	return lines.reduce((sum, secret) => sum + find2000thSecret(+secret), 0);
};
