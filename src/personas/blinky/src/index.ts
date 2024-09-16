import { processMessage } from "./agent";
import { Conversation } from "./conversation";
const run = () =>
	new Promise<boolean>(async () => {
		const conversation = new Conversation();
		conversation.onReceiveMessage(async (channel, sender, message) => {
			console.log(`[${channel}]:[${sender}]:${message}`);
			//perform langchain processing
			if (sender !== "blinky") {
				const response = await processMessage(message);
				if (response === null) {
					console.log("No response");
				} else {
					conversation.sendMessage("blinky", response);
				}
			}
		});
	});

run();
