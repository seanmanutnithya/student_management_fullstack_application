const { DataTypes } = require("sequelize");
const { sequelizeAuthDb } = require("../config/sequelizeConfig");
const Auths = sequelizeAuthDb.define(
  "Auths",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    user_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "auths",
    timestamps: false,
  },
);

module.exports = Auths;
