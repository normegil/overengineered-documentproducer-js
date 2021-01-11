const server = require("./server");
const RabbitMQProducer = require("./producer-rmq");
const port = 3000;

let producer = new RabbitMQProducer("localhost", {
  commands: "report_generation_requests",
  formats: "report_formats_requests",
});

process.once("SIGINT", async function () {
  try {
    await producer.close();
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
});

producer
  .init()
  .then(function () {
    let restserver = server(producer);
    restserver.listen(port, () => {
      console.log(`Listening at http://localhost:${port}`);
    });
  })
  .catch(function (err) {
    console.error(err);
  })
  .finally(function () {
    producer.close();
  });
