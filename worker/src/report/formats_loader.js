const findReport = require("./static_list");

module.exports = async function (cmd) {
  let report = await findReport(cmd.reportName);
  return report.formats;
};
