module.exports = {
  // eslint-disable-next-line no-unused-vars
  internal: function internalError(err, req, res, next) {
    console.error(err);
    res.status(500).send({ error: err });
  },
};
