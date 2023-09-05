const fs = require("fs"); // file system

console.log("1");

// As expected, this step is non-blocking
// requires a callback to handle the result
fs.readFile("test.txt", (err, data) => {
    if (err === null) {
        console.log("contents of the file: ", data)
    }
    else {
        console.error("File Read Exception", err)
    }
}); // Reads file async, returns buff

console.log("2");
