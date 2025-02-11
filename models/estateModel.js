import sequelize from "../config/sequelizeConfig.js";
import { DataTypes, Model } from "sequelize";
import { cityModel } from "./cityModel.js";
import { energyLabelsModel } from "./energyLabelsModel.js";
import { estateTypeModel } from "./estateTypeModel.js";

export class estateModel extends Model {}

estateModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    payout: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    gross: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    net: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    cost: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    num_rooms: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    num_floors: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    floor_space: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ground_space: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    basement_space: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    year_of_construction: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    year_rebuilt: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    floorplan: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    num_clicks: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    city_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: cityModel,
        key: 'id',
      },
    },
    type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: estateTypeModel,
        key: 'id',
      },
    },
    energy_label_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: energyLabelsModel,
        key: 'id',
      },
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["city_id", "type_id", "energy_label_id"],
      },
    ],
    sequelize,
    modelName: "estate",
    underscored: true,
    freezeTableName: false,
    createdAt: true,
    updatedAt: true,
  }
);
