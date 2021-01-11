const amqpclient = require("amqplib");
const EventEmitter = require("events");
const Buffer = require("buffer").Buffer;

module.exports = class Producer {
  constructor(host, queues) {
    this.host = host;
    this.queues = queues;
  }

  async init() {
    this.connection = await amqpclient.connect("amqp://" + this.host);
    this.channel = await this.connection.createChannel();

    this.channel.assertQueue(this.queue.commands, {
      durable: true,
    });
    this.channel.assertQueue(this.queue.formats, {
      durable: true,
    });

    this.channel.responseEmitter = new EventEmitter();
    this.channel.responseEmitter.setMaxListeners(0);
    this.channel.consume(
      this.queue.formats + ".replies",
      (msg) =>
        this.channel.responseEmitter.emit(
          msg.properties.correlationId,
          msg.content
        ),
      { noAck: true }
    );
  }

  async loadFormats(command) {
    return new Promise((resolve) => {
      this.channel.responseEmitter.once(command.id, resolve);
      return JSON.stringify(command);
    }).then((cmd) => {
      this.channel.sendToQueue(this.queues.formats, Buffer.from(cmd), {
        correlationId: command.id,
        persistent: true,
        replyTo: this.queues.formats + ".replies",
        content_type: "application/json",
      });
    });
  }

  async generateReport(command) {
    let cmd = await JSON.stringify(command);
    this.channel.sendToQueue(this.queue.commands, Buffer.from(cmd), {
      persistent: true,
      content_type: "application/json",
    });
  }

  close() {
    return this.connection.close();
  }
};
