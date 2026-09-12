const { DataTypes } = require("sequelize");
const { sequelizeStudentDb } = require("../config/sequelizeConfig");

const Students = sequelizeStudentDb.define(
  "Students",
  {
    id: {
      type: DataTypes.STRING(10),
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    gender: {
      type: DataTypes.CHAR,
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
    remark: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
  },
  {
    tableName: "students",
    timestamps: false,
  },
);

module.exports = Students;
