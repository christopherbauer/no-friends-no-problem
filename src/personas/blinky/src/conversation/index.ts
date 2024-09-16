import { Redis } from "ioredis";
export class Conversation {
	private sub: Redis;
	private pub: Redis;
	constructor() {
		const redisPort = 6379;
		const redisIP = "redis";

		this.sub = new Redis(redisPort, redisIP);
		this.pub = new Redis(redisPort, redisIP);
		this.subscribe();
	}
	private subscribe = async () => {
		this.sub.subscribe("conversation", (err, count) => {
			if (err) {
				console.error(err);
				return;
			} else {
				console.log(`Subscribed to ${count} channels`);
			}
		});
	};
	public onReceiveMessage = async (
		listener: (channel: string, sender: string, response: string) => void
	) => {
		this.sub.on("message", (channel, message) => {
			console.log(message);
			const { sender, response } = JSON.parse(message);
			listener(channel, sender, response);
		});
	};
	public sendMessage = async (sender: string, response: string) => {
		this.pub.publish(
			"conversation",
			JSON.stringify({ sender, response }),
			(err, count) => {
				if (err) {
					console.error(err);
				}
			}
		);
	};
}
