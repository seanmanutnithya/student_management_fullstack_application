const { DataTypes } = require("sequelize");
const { sequelizeStudentDb } = require("../config/sequelizeConfig");

// Mirrors the real `students` table. Columns the model omits are still NOT NULL
// in MySQL, which silently fills them with implicit defaults on insert — and
// because `email` is UNIQUE, the second such row collides on ''.
const Students = sequelizeStudentDb.define(
  "Students",
  {
    id: {
      type: DataTypes.STRING(20),
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    gender: {
      type: DataTypes.CHAR(1),
      allowNull: false,
    },
    std_class: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    dob: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    address: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    guardianName: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    guardianPhone: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    remark: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    // NOT NULL in the table and only wide enough for a filename or short URL --
    // uploads store "/uploads/<file>" here, never the image itself.
    avatar: {
      type: DataTypes.STRING(200),
      allowNull: false,
      defaultValue: "",
    },
    image_url: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
  },
  {
    tableName: "students",
    timestamps: false,
  },
);

module.exports = Students;
