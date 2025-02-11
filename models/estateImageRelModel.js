import sequelize from "../config/sequelizeConfig.js";
import { DataTypes, Model } from "sequelize";
import { estateModel } from "./estateModel.js";
import { imageModel } from "./imageModel.js";

export class estateImageRelModel extends Model {}

estateImageRelModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    estate_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: estateModel,
        key: 'id',
      },
    },
    image_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: imageModel,
        key: 'id',
      },
    },
    is_main: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["estate_id", "image_id"],
      },
    ],
    sequelize,
    modelName: "estate_image_rel",
    underscored: true,
    freezeTableName: true,
    createdAt: true,
    updatedAt: true,
  }
);
