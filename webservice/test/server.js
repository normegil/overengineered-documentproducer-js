const { describe } = require("mocha");
const chai = require("chai");
const chaiHTTP = require("chai-http");
const initServer = require("../src/server");
const FakeProducer = require("./mock/producer");
const uuid = require("uuid");

let should = chai.should();
chai.use(chaiHTTP);

describe("Rest service", function () {
  let server;
  let register;
  before(function () {
    register = new FakeProducer(["TestReport"]);
    server = initServer(register);
  });

  context("when an execution command is sent", function () {
    let resp;
    let command = {
      reportName: "TestReport",
      date: "2020-01-11",
      format: "PDF",
    };
    before(async function () {
      resp = await chai.request(server).post("/command").send(command);
    });

    it("should send an OK response", function () {
      resp.statusCode.should.equal(200);
    });

    describe("Request ID", function () {
      it("should be a UUID", async function () {
        uuid.validate(resp.body.id).should.equal(true);
      });
    });

    describe("when the command is sent to RabbitMQ", function () {
      it("should contain request ID", function () {
        register.lastCommand.id.should.equal(resp.body.id);
      });
      it("should contain all original command properties", function () {
        let mqCommand = register.lastCommand;
        for (const property in command) {
          command[property].should.equal(mqCommand[property]);
        }
      });
    });
  });

  context("when a request for available formats is sent", function () {
    context("for an inexisting report", function () {
      it("should send a 'Not Found' response", async function () {
        let resp = await chai.request(server).get("/formats/inexisting").send();
        resp.statusCode.should.equal(404);
      });
    });
    context("for an existing report", function () {
      let resp;
      let reportName = "TestReport";
      before(async function () {
        resp = await chai
          .request(server)
          .get("/formats/" + reportName)
          .send();
      });
      it("should send an 'OK' response", function () {
        resp.statusCode.should.equal(200);
      });
      it("should return a list of available format", function () {
        resp.body.should.have.members(["PDF"]);
      });
      context("when the command is sent to RabbitMQ", function () {
        it("should contain request ID", function () {
          should.exist(register.lastFormatRequest.id);
        });
        it("should contain the reportName", function () {
          register.lastFormatRequest.reportName.should.equal(reportName);
        });
      });
    });
  });

  context("when not exiting path is requested", async function () {
    let resp;
    before(async function () {
      resp = await chai.request(server).get("/not-found").send();
    });
    it("should send an 'Not found' response", function () {
      resp.status.should.equal(404);
    });
  });
});
