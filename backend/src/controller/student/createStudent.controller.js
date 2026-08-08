const { studentDB } = require("../../config/config");
const logs_error = require("../../helper/logs_error");

const createStudent = async (req, res) => {
  const mysql = `
    INSERT INTO students (id, name, gender, std_class, phone, image_url) VALUES
    (?,?,?,?,?,?);
  `;
  try {
    const field = ({ id, name, gender, std_class, phone, image_url } =
      req.body);
    await studentDB.query(mysql, [
      id,
      name,
      gender,
      std_class,
      phone,
      image_url,
    ]);
    const student = {
      id,
      name,
      gender,
      std_class,
      phone,
      image_url,
    };
    res.send({
      student,
    });
  } catch (error) {
    const content = error.message;
    logs_error(content + "\n");
    res.send({ status: false, message: content });
  }
};

module.exports = createStudent;
