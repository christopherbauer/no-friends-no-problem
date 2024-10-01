const { ipcRenderer } = require("electron");

ipcRenderer.on("sync-conversation", (event, arrayData) => {
	console.log("Received array from main process:", arrayData);
	const list = document.getElementById("messageList");
	list.innerHTML = ""; // Clear any previous entries
	arrayData.forEach((item) => {
		const li = document.createElement("li");
		const { sender, response } = item;
		console.log(`${sender}: ${response}`);
		li.textContent = `${sender}: ${response}`;
		li.className = sender === "human" ? "human" : "bot";
		list.appendChild(li);
	});
	const container = document.getElementById("conversation-history");
	container.scrollTop = container.scrollHeight;
});
document.addEventListener("DOMContentLoaded", () => {
	const textarea = document.getElementById("messageArea");

	textarea.addEventListener("keydown", (event) => {
		if (event.key === "Enter") {
			event.preventDefault(); // Prevents new line in textarea

			const message = textarea.value.trim(); // Get and trim the message
			if (message) {
				console.log("Sending message to main process:", message);

				// Send message to the main process
				ipcRenderer.send("send-to-redis", message);

				// Optionally, clear the textarea
				textarea.value = "";
			}
		}
	});
});
