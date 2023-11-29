const http = require("http");
/*
    Server maintains a DS to store the requestID and response for different client
    Client -> Server (Response w/ request ID)
    Client -> Server (Block the clien, No response until its is ready)

*/


// Request cache would be of the form "requestId": data
const requestCache = {};

const runJob = async (requestId) => {
    const intervalId = setInterval(() => {
        requestCache[requestId] += 10;
        if (requestCache[requestId] + 10 >= 100) {
            requestCache[requestId] = 100;
            clearInterval(intervalId);
        }
        console.log("Request Cache: ", requestCache);
    }, 4000)
}

const registerRequest = () => {
    const requestId = Date.now();
    requestCache[requestId] = 0;
    // start job in background
    runJob(requestId);
    return requestId;
}


const waitForJobCompletion = async (requestId) => {
    return new Promise((resolve, reject) => {
        if (requestCache[requestId] < 100) {
            // This will allow the server to breath and won't hog the main thread
            setTimeout(() => resolve(false), 1000);
        }
        else resolve(true);
    })
}


const jobStatus = async (requestId, res) => {
    // wait until the job's completed
    // while(requestCache[requestId] < 100) // This will block the server,
    while (await waitForJobCompletion(requestId) === false);

    res.end(`Status: ${requestCache[requestId]}`)
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
                const requestID = url.searchParams.get("requestId");
                const status = jobStatus(requestID, res);
                console.log("Job Status"); break;

            default: res.statusCode = 404; res.end("Error");
        }
    }

});

const PORT = 8082
server.listen(8082, () => {
    console.log(`Listening on ${PORT} ...`)
});