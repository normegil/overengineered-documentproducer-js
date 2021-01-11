const uuid = require("uuid");

module.exports = class FormatsController {
  constructor(formatHandler) {
    this.formatHandler = formatHandler;
  }

  async loadFormats(req, res) {
    let id = uuid.v4();

    let command = {
      id: id,
      reportName: req.params.reportName,
    };

    try {
      let formats = await this.formatHandler.loadFormats(command);
      res.send(formats);
    } catch (e) {
      if (/^NotFound.*/.test(e.message)) {
        res.status(404);
        res.send(e);
      } else {
        throw e;
      }
    }
  }
};
