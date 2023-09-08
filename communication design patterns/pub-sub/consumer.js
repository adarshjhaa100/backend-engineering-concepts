const amqp = require("amqplib");
// Connect to cloudAMQP
const connect = async () => {
    try {
        const amqpURL = "amqps://oqskydkp:cQg7wcB_Bqjv0Qf55mSwRnTiwbX8oHyA@puffin.rmq2.cloudamqp.com/oqskydkp"
        const queueName = "jobs";
        const conn = await amqp.connect(amqpURL);
        const channel = await conn.createChannel(); // Channel: Virtual connection inside TCP connection. Used to send TCP commands to the broker

        console.log("Consumer Connected...")

        await channel.assertQueue(queueName); // Create the message q if not exists

        // Consume message from the specified queue. This is giving empty messages, why?
        // A promise
        channel.consume(queueName, (message) => {
            console.log("Received message: ", message.content.toString())

            if (message.content === "")
                channel.ack(message) // To remove the message from the Q
        })


        // Dont close 
        console.log("Waiting for messages...")


    } catch (ex) {
        console.error(ex);
    }
}

connect();


