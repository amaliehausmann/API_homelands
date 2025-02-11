import sequelize from "../config/sequelizeConfig.js";
import { DataTypes, Model } from "sequelize";
import bcrypt from "bcrypt";

export class userModel extends Model {}

userModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    refresh_token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "user",
    underscored: true,
    freezeTableName: false,
    createdAt: true,
    updatedAt: true,
    hooks: {
      beforeCreate: async (userModel, options) => {
        userModel.password = await createHash(userModel.password);
      },
      beforeUpdate: async (userModel, options) => {
        userModel.password = await createHash(userModel.password);
      },
    },
  }
);

const createHash = async (string) => {
  const salt = await bcrypt.genSalt(10);
  const hashedString = await bcrypt.hash(string, salt);
  return hashedString;
};
