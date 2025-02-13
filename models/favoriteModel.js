import sequelize from "../config/sequelizeConfig.js";
import { DataTypes, Model } from "sequelize";
import { userModel } from "./userModel.js";
import { estateModel } from "./estateModel.js";

export class favoriteModel extends Model {}

favoriteModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: userModel,
        key: 'id',
      },
    },
    estate_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: estateModel,
        key: 'id',
      },
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["user_id", "estate_id"],
      },
    ],
    sequelize,
    modelName: "favorite",
    underscored: true,
    freezeTableName: false,
    createdAt: true,
    updatedAt: true,
  }
);
