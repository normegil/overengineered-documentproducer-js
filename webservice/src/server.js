const express = require("express");
const server = express();
const bodyParser = require("body-parser");
const errors = require("./errors");
const DocumentController = require("./document");
const FormatsController = require("./formats");

module.exports = function initServer(producer) {
  server.use(bodyParser.urlencoded());
  server.use(bodyParser.json());
  server.use(errors.internal);

  let documentCtrl = new DocumentController(producer);
  let formatsCtrl = new FormatsController(producer);

  server
    .route("/documents")
    .post((req, res) => documentCtrl.generateReport(req, res));

  server
    .route("/formats/:reportName")
    .get((req, res) => formatsCtrl.loadFormats(req, res));

  return server;
};
