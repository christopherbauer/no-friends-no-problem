const wait = (ms: number) => {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
};
const run = () =>
	new Promise<boolean>(async (resolve, reject) => {
		let running = true;
		while (running) {
			await wait(1000);
			console.log("Running...");
		}
		resolve(true);
	});

run();
