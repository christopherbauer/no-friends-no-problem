export const getRandom = (min: number, max: number) => {
	const minCeiled = Math.ceil(min);
	const maxFloored = Math.floor(max);
	return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
};

export const wait = (ms: number) =>
	new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
