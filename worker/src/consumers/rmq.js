const amqpclient = require("amqplib");

module.exports = class Consumer {
  constructor(host, listeners) {
    this.host = host;
    this.listeners = listeners;
  }

  async init() {}

  close() {
    return this.connection.close();
  }
};

function loadFormat(msg, responseQueue) {}
