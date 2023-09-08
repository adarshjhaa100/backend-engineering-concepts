/**
    Client Code:
    new sse = new EventSource(url)
    sse.onmessage = console.log
    sse.close // if required to close the event
*/


const http = require("http");
/*
    Client -> Initial request to server
    Server -> Responds back with special type of response called event steams
    response should be of the format: res.write("data:...\n\n")

    This demo returns the status of job as an event 
    */
const streamJobStatus = (res, progress) => {
    setInterval(() => {
        res.write(`data:hello[${progress}]world\n\n`);
        progress += 1;
    }, 1000);
}


const server = http.createServer((req, res) => {
    res.statusCode = 200;

    // Parse the URL received, returns an object 
    const url = new URL(req.url, `http://${req.headers.host}`);
    const reqs = req;

    if (req.method === "GET") {
        switch (url.pathname) {
            case "/stream":
                res.setHeader("Content-Type", "text/event-stream");
                res.setHeader("Access-Control-Allow-Origin", "*")
                let progress = 0;
                streamJobStatus(res, progress);
                break;
            default: res.statusCode = 404; res.end("Error");
        }
    }

});

const PORT = 8888;
server.listen(PORT, () => {
    console.log(`Listening on ${PORT} ...`)
});