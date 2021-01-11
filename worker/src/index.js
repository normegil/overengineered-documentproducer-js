const amqpclient = require("amqplib");
const loadFormat = require("./report/formats_loader");
const Buffer = require("buffer").Buffer;

(async () => {
  let connection = amqpclient.connect("amqp://" + host);
  let channel = await connection.createChannel();

  channel.assertQueue(this.queue.formats + ".replies", {
    durable: true,
  });

  channel.assertQueue("report_formats_requests", {
    durable: true,
  });
  channel.consume("report_formats_requests", async (msg) => {
    console.log(msg.content.toString());
    let cmd = await JSON.parse(msg.content);
    let format = await loadFormat(cmd);
    await channel.sendToQueue(this.queue.commands, Buffer.from(format), {
      persistent: true,
      content_type: "application/json",
    });
  });

  channel.assertQueue("report_generation_requests", {
    durable: true,
  });
  channel.consume("report_generation_requests", {});

  process.once("SIGINT", async function () {
    try {
      await consumers.close();
      process.exit(0);
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  });
})();
