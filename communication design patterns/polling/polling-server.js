const http = require("http");
/*
    Server maintains a DS to store the requestID and response for different client
    Client -> Server (Response w/ request ID)
    Client -> Server (Respond that request is not ready)
*/


// Request cache would be of the form "requestId": data
const requestCache = {};

const runJob = async (requestId) => {
    const intervalId = setInterval(() => {
        if (requestCache[requestId] >= 100) {
            requestCache[requestId] = 100;
            clearInterval(intervalId);
        }
        requestCache[requestId] += 10;
        console.log("Request Cache: ", requestCache);
    }, 10000)
}

const registerRequest = () => {
    const requestId = Date.now();
    requestCache[requestId] = 0;
    // start job in background
    runJob(requestId);
    return requestId;
}

const jobStatus = (requestId) => {
    return requestCache[requestId];
}


const server = http.createServer((req, res) => {
    res.statusCode = 200;


    // Parse the URL received, returns an object 
    const url = new URL(req.url, `http://${req.headers.host}`);
    console.log(url)
    // console.log(req.method, url.searchParams.get("requestId"));

    res.setHeader("Content-Type", "text/plain");

    if (req.method === "GET") {
        switch (url.pathname) {
            case "/registerRequest":
                const requestId = registerRequest()
                res.end(`${requestId}`);
                break;
            case "/jobStatus":
                const status = jobStatus(url.searchParams.get("requestId"));
                res.end(`${status}`); break;
            default: res.statusCode = 404; res.end("Error");
        }
    }

});


server.listen(8082, () => {
    console.log("Listening on 8081 ...")
});