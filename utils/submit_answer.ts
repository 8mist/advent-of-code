import { delay } from "./delay";
import { logger } from "./logger";

export enum AnswerState {
	Waiting = "Waiting",
	Correct = "Correct",
	Incorrect = "Incorrect",
	AlreadySubmitted = "AlreadySubmitted",
	TooRecently = "TooRecently",
	Unrecognized = "Unrecognized",
}

export const submitAnswer = async (
	answer: string,
	year: string,
	day: string,
	level: string,
): Promise<AnswerState> => {
	const { AOC_SESSION_COOKIE } = process.env;
	if (!AOC_SESSION_COOKIE) {
		throw new Error("AOC_SESSION_COOKIE is not defined");
	}

	const url = `https://adventofcode.com/${year}/day/${+day}/answer`;
	const body = new URLSearchParams({ level, answer });
	const res = await fetch(url, {
		method: "POST",
		headers: {
			cookie: `session=${AOC_SESSION_COOKIE}`,
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: body,
	});

	if (res.status !== 200) {
		throw new Error(
			`Fetching "${url}" failed with status ${res.status}:\n${await res.text()}`,
		);
	}

	let state = AnswerState.Waiting;

	const response = await res.text();
	if (response.includes("You gave an answer too recently")) {
		const match = response.match(/You have (.*?) left to wait/);

		if (!match) {
			logger.error(
				"You gave an answer too recently but the time couldn't be parsed.",
			);
			return AnswerState.TooRecently;
		}

		const time = match[1];
		const [, min, sec] = time.match(/(?:(\d+)m )?(\d+)s/) ?? [];

		for (let seconds = ~~min * 60 + ~~sec; seconds > 0; seconds--) {
			process.stdout.clearLine(0);
			process.stdout.cursorTo(0);
			process.stdout.write(
				`You gave an answer too recently, waiting ${time} (${seconds}s remaining) before submitting.`,
			);

			await delay(1000);
		}

		logger("");

		return submitAnswer(answer, year, day, level);
	}

	if (response.includes("Did you already complete it?")) {
		logger.warn("Answer already submitted");
		state = AnswerState.AlreadySubmitted;
	} else if (response.includes("not the right answer")) {
		if (response.includes("too high")) {
			logger.error("Answer is too high");
			state = AnswerState.Incorrect;
		} else if (response.includes("too low")) {
			logger.error("Answer is too low");
			state = AnswerState.Incorrect;
		} else {
			logger.error("Answer not correct");
			state = AnswerState.Incorrect;
		}
	} else if (response.includes("That's the right answer!")) {
		logger.success("Solved!");
		state = AnswerState.Correct;
	}

	return state;
};
