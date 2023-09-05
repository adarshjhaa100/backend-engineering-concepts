/* Note: Run this code from the browser */

const ws = new WebSocket("ws://localhost:8082");

// Event listener to display message
ws.addEventListener("message", (message) => { console.log(message.data) })

ws.removeEventListener("message")

ws.send("Hello!")
