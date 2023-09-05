const http = require("http");
const WebSocketServer = require("websocket").server
let connections = [];

//create a raw http server (this will help us create the TCP which will then pass to the websocket to do the job)
const httpserver = http.createServer()

//pass the httpserver object to the WebSocketServer library to do all the job, this class will override the req/res 
const websocket = new WebSocketServer({ "httpServer": httpserver })
//listen on the TCP socket
httpserver.listen(8082, () => console.log("My server is listening on port 8082"))


//when a legit websocket request comes to the server listen to it and get the connection .. once you get a connection thats it! 
websocket.on("request", request => {

    // console.log("WS request: ", request);

    const connection = request.accept(null, request.origin) // only when connecting

    // message from a connection
    connection.on("message", message => {
        //someone just sent a message tell everybody
        connections.forEach(c => {


            console.log("single connection: ", message, request.socket.remotePort)

            // Send remote port to identify distinct user, not applicable in practice
            // Send to all except
            if (c !== connection)
                c.send(`User ${connection.socket.remotePort} 
                    says: \n${message.utf8Data}`)
        })
    })
    connections.push(connection)

    console.log("Connections: ", connections.length);

    // someone just connected, tell everybody
    connections.forEach(c => c.send(`User${connection.socket.remotePort} just connected.`))

})


//client code 
//let ws = new WebSocket("ws://localhost:8080");
//ws.onmessage = message => console.log(`Received: ${message.data}`);
//ws.send("Hello! I'm client")