const amqp = require('amqplib');

class Analytics_pub {
    constructor() {
        this.channel = null;
        this.connection = null;
    }

    async createChannel() {
        try {
            this.connection = await amqp.connect(`amqp://rabbitmq`);
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
            const queue = "analytics_queue";
            await this.channel.assertQueue(queue, { durable: true });
            this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)));
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

module.exports = Analytics_pub;
