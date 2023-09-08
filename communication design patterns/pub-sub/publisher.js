const amqp = require("amqplib");
// Connect to cloudAMQP
const message = { number: process.argv[2] }

const connect = async () => {
    try {
        const amqpURL = "amqps://oqskydkp:cQg7wcB_Bqjv0Qf55mSwRnTiwbX8oHyA@puffin.rmq2.cloudamqp.com/oqskydkp"
        const queueName = "jobs";
        const conn = await amqp.connect(amqpURL);
        const channel = await conn.createChannel(); // Channel: Virtual connection inside TCP connection. Used to send TCP commands to the broker

        console.log("Publisher Connected...")

        await channel.assertQueue(queueName); // Create the message q if not exists
        await channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)))

        // Close channel and connection
        await channel.close();
        await conn.close();

    } catch (ex) {
        console.error(ex);
    }
}

connect();


