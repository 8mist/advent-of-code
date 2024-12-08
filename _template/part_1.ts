import fs from 'node:fs';

const testInput = fs.readFileSync(new URL('./input.test', import.meta.url), 'utf-8');
export const testCase = [testInput, 0];

const format = (input: string): string[] => {
  return input.replace(/\r/g, '').trim().split('\n');
};

export const solve = (input: string) => {
  const lines = format(input);
  return lines;
};
