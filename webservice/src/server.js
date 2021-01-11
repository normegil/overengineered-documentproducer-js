const express = require("express");
const server = express();
const bodyParser = require("body-parser");
const errors = require("./errors");
const CommandController = require("./command");
const FormatsController = require("./formats");

module.exports = function initServer(producer) {
  server.use(bodyParser.urlencoded());
  server.use(bodyParser.json());
  server.use(errors.internal);

  let commandCtrl = new CommandController(producer);
  let formatsCtrl = new FormatsController(producer);

  server
    .route("/command")
    .post((req, res) => commandCtrl.generateReport(req, res));

  server
    .route("/formats/:reportName")
    .get((req, res) => formatsCtrl.loadFormats(req, res));

  return server;
};
