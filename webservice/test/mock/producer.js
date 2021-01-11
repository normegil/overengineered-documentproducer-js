module.exports = class Producer {
  constructor(existingReports) {
    this.existingReports = existingReports;
  }

  async generateReport(command) {
    this.lastCommand = command;
  }

  async loadFormats(command) {
    if (!this.existingReports.includes(command.reportName)) {
      throw new Error("NotFound: Report{" + command.reportName + "}");
    }
    this.lastFormatRequest = command;
    return ["PDF"];
  }
};
