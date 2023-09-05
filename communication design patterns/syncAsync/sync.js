const fs = require("fs"); // file system

console.log("1");

// As expected, this step is blocking
const contents = fs.readFileSync("test.txt"); // Reads file sync, returns buff

console.log("contents of the file: ", contents);


console.log("2");






