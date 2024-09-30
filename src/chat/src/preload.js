const { ipcRenderer } = require("electron");
window.electronAPI = {
	sendToRedis: (message) => ipcRenderer.send("send-to-redis", message),
};
