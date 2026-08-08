const db = require("../config/config");
const logs_error = require("../helper/logs_error");
const { missingValues, checkTargetId } = require("../helper/validate");

const udpateStudent = async (req, res) => {
  try {
    const sql = `
        UPDATE students SET id=?,name=?,gender=?,std_class=?,phone=?,image_url=?,remark=? 
        WHERE students.id=?        
    `;
    const targetId = req.params.targetId;
    const field = ({ id, name, gender, std_class, phone, image_url, remark } =
      req.body);

    await checkTargetId(res, targetId);
    await missingValues(res, field);
    await db.query(sql, [
      id,
      name,
      gender,
      std_class,
      phone,
      image_url,
      gender,
      targetId,
    ]);

    res.send({
      status: true,
      message: "updated student!",
    });
  } catch (error) {
    const content = error.message;
    logs_error(content + "\n");
    res.status(500).send({
      status: false,
      message: content,
    });
  }
};

module.exports = udpateStudent;
