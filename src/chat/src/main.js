const { app, BrowserWindow, ipcMain } = require("electron/main");
const redis = require("redis");
const path = require("node:path");

let mainWindow;
function createWindow() {
	mainWindow = new BrowserWindow({
		width: 2400,
		height: 1600,
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
			nodeIntegration: true,
			contextIsolation: false,
			enableRemoteModule: true,
		},
	});
	mainWindow.loadFile("src/index.html");
	mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
	createWindow();

	app.on("activate", () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow();
		}
	});
});

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

const publisher = redis.createClient({
	host: "redis",
	port: 6379,
});

conversation = [];
publisher.connect();
publisher.on("connect", () => {
	console.log("⚡ Ready to publish to Redis");
});

publisher.on("error", (err) => {
	console.error("Redis error:", err);
});

const subscriber = redis.createClient({
	host: "redis",
	port: 6379,
});

subscriber.connect();
subscriber.on("connect", () => {
	console.log("⚡ Ready to receive from Redis");
});
subscriber.subscribe("conversation", (message) => {
	const { sender, response } = JSON.parse(message);
	console.log(`[conversation]:[${sender}]:${response}`);
	conversation.push({
		sender: sender,
		response: response,
	});

	mainWindow.webContents.send("sync-conversation", conversation);
});

ipcMain.on("send-to-redis", (event, message) => {
	// Send message to Redis
	console.log("Sending message to Redis:", message);
	publisher.publish(
		"conversation",
		JSON.stringify({ sender: "human", response: message }),
		(err, reply) => {
			if (err) {
				console.error("Error sending message to Redis:", err);
			} else {
				console.log("Message sent to Redis:", reply);
			}
		}
	);
});
