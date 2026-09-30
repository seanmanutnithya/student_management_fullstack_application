const { DataTypes } = require("sequelize");
const { sequelizeFeeDB } = require("../config/sequelizeConfig");

const fees = sequelizeFeeDB.define(
  "fees",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    studentId: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    academicYear: {
      type: DataTypes.SMALLINT,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("unpaid", "paid"),
      defaultValue: "unpaid",
      allowNull: false,
    },
    paidDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "fees",
    timestamps: true,
  },
);
module.exports = fees;
