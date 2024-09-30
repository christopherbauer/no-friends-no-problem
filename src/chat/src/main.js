const { app, BrowserWindow, ipcMain } = require("electron/main");
const redis = require("redis");
const path = require("node:path");
const client = redis.createClient({
	host: "redis",
	port: 6379,
});
conversation = [];
client.connect();

client.on("connect", () => {
	console.log("Connected to Redis");
});

client.on("message", (channel, message) => {
	const { sender, response } = JSON.parse(message);
	console.log(`[${channel}]:[${sender}]:${response}`);
	conversation.push([
		{
			sender: sender,
			response: response,
		},
	]);
	ipcMain.emit("sync-conversation", conversation);
});

client.on("error", (err) => {
	console.log("Redis error:", err);
});

ipcMain.on("send-to-redis", (event, message) => {
	// Send message to Redis
	console.log("Sending message to Redis:", message);
	client.publish(
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

function createWindow() {
	const win = new BrowserWindow({
		width: 2400,
		height: 1600,
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
			nodeIntegration: true,
			contextIsolation: false,
			enableRemoteModule: true,
		},
	});
	win.loadFile("src/index.html");
	win.webContents.openDevTools();
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
