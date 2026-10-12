const { sequelizeEnrDB } = require("../config/sequelizeConfig");
const DataTypes = require("sequelize");

const enrollments = sequelizeEnrDB.define(
  "enrollments",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    studentId: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: "student_id",
    },
    academic_year: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "academic_year",
    },
  },
  {
    tableName: "enrollments",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["student_id", "academic_year"],
      },
    ],
  },
);
module.exports = enrollments;
