const Students = require("../../models/Students");
const { missingValues } = require("../../helper/validate");
const logs_error = require("../../helper/logs_error");
// const sendTelegramMessage = require("../../helper/sendTelegramMessage");

// A primary-key collision is reported against the constraint name rather than
// the column, which is no use to a form that wants to highlight one input.
const COLUMN_BY_CONSTRAINT = { PRIMARY: "id" };

const udpateStudent = async (req, res) => {
  try {
    const targetId = req.params.targetId;
    const {
      id,
      name,
      gender,
      std_class,
      phone,
      dob,
      email,
      address,
      guardianName,
      guardianPhone,
      remark,
    } = req.body;

    const field = {
      id,
      name,
      gender,
      std_class,
      phone,
      dob,
      email,
      address,
      guardianName,
      guardianPhone,
    };
    const missing = await missingValues(field);
    if (missing.length > 0) {
      const fields = missing.map(([key]) => key);
      return res.status(400).json({
        status: false,
        message: `${fields.join(", ")} is required!`,
        fields,
        reason: "missing",
      });
    }

    const existing = await Students.findByPk(targetId);
    if (!existing) {
      return res.status(404).json({
        status: false,
        message: "TargetId not found!",
      });
    }

    // Scoped by the id in the URL, not the one in the body — the form is
    // allowed to change the id itself.
    await Students.update(
      { ...field, remark: remark || null },
      { where: { id: targetId } },
    );

    const student = await Students.findByPk(id ?? targetId);

    const message = `
    ✅ <b>Student Updated!</b>
        <b>ID:</b> <code>${student.id}</code>
        <b>Name:</b> ${student.name}
        <b>Gender:</b> ${student.gender}
        <b>Class:</b> ${student.std_class}
        <b>Phone:</b> <code>${student.phone}</code>
        <b>Remark:</b> ${student.remark}
    `.trim();

    // await sendTelegramMessage(message);

    res.status(200).json({
      status: true,
      message: "updated student!",
      student,
    });
  } catch (error) {
    // A unique-constraint failure reports its message as the opaque
    // "Validation error"; the column that actually collided is in `errors`.
    const isDuplicate = error.name === "SequelizeUniqueConstraintError";
    const fields = [
      ...new Set(
        (error.errors ?? []).map((e) => COLUMN_BY_CONSTRAINT[e.path] ?? e.path),
      ),
    ];
    const detail =
      isDuplicate && fields.length > 0 ?
        `${fields.join(", ")} already exists!`
      : error.errors?.map((e) => e.message).join(", ") || error.message;

    logs_error(`${error.name}: ${detail}\n`);

    const isBadInput = isDuplicate || error.name === "SequelizeValidationError";
    res.status(isBadInput ? 400 : 500).json({
      status: false,
      message: detail,
      fields,
      reason: isDuplicate ? "duplicate" : "invalid",
    });
  }
};

module.exports = udpateStudent;
