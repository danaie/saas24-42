const amqp = require('amqplib');

//To use just import it and call the publish_msg(json obj)


class new_sub_pub { //new_submission sends msg {user_id:"", username:"", problem_name:"",script:"",problem_id:""}
    constructor() {
        this.channel = null;
        this.connection = null;
    }

    async createChannel() {
        try {
            this.connection = await amqp.connect("amqp://user:1234@localhost"); 
            this.channel = await this.connection.createChannel();
        } catch (error) {
            console.error("Failed to create channel:", error);
            throw error; // Rethrow the error after logging it
        }
    }

    async publish_msg(msg) {
        try {
            if (!this.channel) {
                await this.createChannel();
            }
            const queue = "new_submission";
            await this.channel.assertQueue(queue, { durable: false });
            this.channel.sendToQueue(queue, Buffer.from(JSON.stringify({
                user_id: msg.user_id,
                username: msg.username,
                problem_name: msg.problem_id,
                script: msg.script,
                problem_id: msg.problem_id
            })));
            console.log(`The message ${JSON.stringify(msg)} is sent to the queue "${queue}"`);
        } catch (error) {
            console.error("Failed to publish message:", error);
        }
    }

    async closeConnection() {
        try {
            if (this.channel) {
                await this.channel.close();
            }
            if (this.connection) {
                await this.connection.close();
            }
        } catch (error) {
            console.error("Failed to close connection:", error);
        }
    }
}

module.exports = new_sub_pub;
