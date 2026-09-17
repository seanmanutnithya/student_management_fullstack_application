const { DataTypes } = require("sequelize");
const { sequelizeTeacherDB } = require("../config/sequelizeConfig");

const Teachers = sequelizeTeacherDB.define(
  "Teachers",
  {
    id: {
      type: DataTypes.STRING(10),
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
    },
    phone: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
    },
    subject: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    dept: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    exp: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    qualification: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    joinDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    avatar: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    tableName: "teachers",
    timestamps: false,
  },
);

module.exports = Teachers;
