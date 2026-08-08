const db = require("../config/config");

const createStudent = async (req, res) => {
  const mysql = `
    INSERT INTO students (id, name, gender, std_class, phone, image_url) VALUES
    (?,?,?,?,?,?);
  `;
  try {
    const field = ({ id, name, gender, std_class, phone, image_url } =
      req.body);
    await db.query(mysql, [id, name, gender, std_class, phone, image_url]);
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
    res.send({ status: false, message: error });
  }
};

module.exports = createStudent;
