const testreport = require("./definitions/test_report");

const reports = [testreport];

module.exports = async function (reportName) {
  for (const report in reports) {
    if (report.name === reportName) {
      return report;
    }
  }
  return undefined;
};
