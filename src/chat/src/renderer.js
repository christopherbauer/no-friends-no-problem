const { ipcRenderer } = require("electron");
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
