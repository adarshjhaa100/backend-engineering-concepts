import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";

// Load Grpc Object from file
const packageDef = protoLoader.loadSync("sample.proto");
const grpcObject = grpc.loadPackageDefinition(packageDef);
const employeePackage = grpcObject?.employeePackage;


const client = new employeePackage
    .EmployeeService("localhost:8081", 
        grpc.credentials.createInsecure()); // create a client with the socket desc

// console.log(client);

const createSampleEmployee = ()=>{
    return {
        "id":-1,
        "name":`Employee ${new Date().toISOString()}`,
        "address":{
            "text":"Delhi",
            "areaCode":110010
        },
        "daysOff":["Saturday", "Sunday"]
    }
}


// rpc to the server stub

client.addEmployee(createSampleEmployee(), (err, res)=>{
    if(!err){
        console.log("Received: ", res);
    }
})

// client.getEmployees(createSampleEmployee(), (err, res)=>{
//     if(!err){
//         console.log("Received Employees: ", res);
//     }
// })


const readEmployeeStream = client.getEmployeesStream(); //For streams, returns stream rather than callback

readEmployeeStream.on("data", item => console.log("Received: ", item));
readEmployeeStream.on("end", e=>console.log("Endd"));



