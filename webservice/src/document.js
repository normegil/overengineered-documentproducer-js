const uuid = require("uuid");

module.exports = class DocumentController {
  constructor(producer) {
    this.producer = producer;
  }

  async generateReport(req, res) {
    let id = uuid.v4();
    let command = req.body;
    command.id = id;

    await this.producer.generateReport(command);

    res.send({
      id: id,
    });
  }
};
