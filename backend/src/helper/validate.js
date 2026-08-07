async function missingValues(req, res, field) {
  const missing = Object.entries(field).filter(([key, value]) =>
    value == "" ? true
    : value == null ? true
    : false,
  );
  if (missing.length > 0) {
    return res.status(404).send({
      message: `${missing.map(([key]) => key).join(", ")} is required!`,
    });
  }
}

module.exports = { missingValues };
