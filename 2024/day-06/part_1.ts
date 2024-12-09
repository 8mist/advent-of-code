import fs from "node:fs";

const testInput = fs.readFileSync(
	new URL("./input.test", import.meta.url),
	"utf-8",
);
export const testCase = [testInput, 41];

const format = (input: string): string[][] => {
	return input
		.replace(/\r/g, "")
		.trim()
		.split("\n")
		.map((line) => line.split(""));
};

type Coords = [number, number]

const findGuard = (input: string[][]): Coords => {
  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[y].length; x++) {
      if (input[y][x] === '^') {
        return [y, x]
      }
    }
  }

  throw new Error("Guard not found on the map.");
}

const findObstacles = (input: string[][]): Coords[] => {
  const obstacles: Coords[] = []
  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[y].length; x++) {
      if (input[y][x] === '#') {
        obstacles.push([y, x])
      }
    }
  }
  return obstacles
}

const moveGuard = (
  [y, x]: Coords,
  obstacles: Coords[],
  map: string[][],
  preventLoops = false,
): { visited: Set<string>; isLoop: boolean } => {
  const visited = new Set<string>()
  const obstacleSet = new Set(obstacles.map(([oy, ox]) => `${oy},${ox}`))
  let dir = 0

  while (true) {
    const key = `${y},${x}` + (preventLoops ? `,${dir}` : '')

    if (preventLoops && visited.has(key)) {
      return { visited, isLoop: true }
    }

    visited.add(key)

    let ny = y
    let nx = x
    if (dir === 0) ny--
    if (dir === 1) nx++
    if (dir === 2) ny++
    if (dir === 3) nx--

    if (ny < 0 || ny >= map.length || nx < 0 || nx >= map[ny].length) {
      return { visited, isLoop: false }
    }

    if (obstacleSet.has(`${ny},${nx}`)) {
      dir = (dir + 1) % 4
    } else {
      y = ny
      x = nx
    }
  }
}

export const solve = (input: string): number => {
  const map: string[][] = format(input);
  const guard = findGuard(map)
  const obstacles = findObstacles(map)
  const { visited } = moveGuard(guard, obstacles, map)
  return visited.size
};
