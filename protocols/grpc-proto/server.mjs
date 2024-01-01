import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";

// Load Grpc Object from file
const packageDef = protoLoader.loadSync("sample.proto");
const grpcObject = grpc.loadPackageDefinition(packageDef);
const employeePackage = grpcObject?.employeePackage;

// console.log(employeePackage);

//define service handlers. call is the req, callback the res
const employees = [];

const addEmployee = (call, callback)=>{
    console.log("Add employee: ", call.request);

    const newEmployee = {...call.request, "id": employees.length+1};

    if(call.request !== undefined){
        employees.push(newEmployee);
    }

    // bytes written, payload
    callback(null, newEmployee);

    // console.log("employees:", employees);

}

const getEmployees = (call, callback)=>{
    // console.log("Get employee: ", call);

    callback(null, {
        "employeeEntity": employees // return 
    });
}


const getEmployeesStream = (call, callback)=>{
    console.log("Get Employee: ", call);
    // stream: no callback, write to call
    employees.forEach( employee => call.write(employee) );

    call.end();
}


// Create server and bind port and add the services(server stub) to it
const server = new grpc.Server();
server.bindAsync("0.0.0.0:8081", grpc.ServerCredentials.createInsecure(),
(err,port)=>{
    server.addService(employeePackage.EmployeeService.service, {
        "addEmployee": addEmployee, // the key should have the same name as before
        "getEmployees": getEmployees,
        "getEmployeesStream": getEmployeesStream
    }); // Now, these are the GRPC stubs that can be called from the client
    
    server.start(); 
    console.log("Listening...", port)
});





