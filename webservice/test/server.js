const { describe } = require("mocha");
const chai = require("chai");
const chaiHTTP = require("chai-http");
const app = require("../src/server");

chai.should();
chai.use(chaiHTTP);

describe("When rest service is listening", function () {
  context("when root is requested", function () {
    let resp;
    before(async function () {
      resp = await chai.request(app).get("/").send();
    });
    it("it should send an OK response", function () {
      resp.status.should.equal(200);
    });
    it("it should send 'Hello World' string", function () {
      resp.text.should.equal("Hello World!");
    });
  });

  context("when not exiting path is requested", async function () {
    let resp;
    before(async function () {
      resp = await chai.request(app).get("/not-found").send();
    });
    it("it should send an 'Not found' response", function () {
      resp.status.should.equal(404);
    });
  });
});
