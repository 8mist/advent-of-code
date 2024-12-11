import fs from "node:fs";

const testInput = fs.readFileSync(
	new URL("./input.test", import.meta.url),
	"utf-8",
);
export const testCase = [testInput, 55312];

const format = (input: string): string[] => {
	return input.replace(/\r/g, "").trim().split(" ");
};

const applyTransformation = (stones: string[]): string[] => {
  const newStones: string[] = [];
  for (const stone of stones) {
    if (stone === "0") {
      newStones.push("1");
    } else if (stone.length % 2 === 0) {
      const mid = stone.length / 2;
      const left = stone.slice(0, mid);
      const right = stone.slice(mid).replace(/^0+/, "");
      if (left) newStones.push(left);
      if (right) {
        newStones.push(right);
      } else {
        newStones.push("0");
      }
    } else {
      newStones.push((parseInt(stone) * 2024).toString());
    }
  }
  return newStones;
};

export const solve = (input: string) => {
  let stones = format(input);
  for (let i = 0; i < 25; i++) {
    stones = applyTransformation(stones);
  }
  return stones.length;
};
