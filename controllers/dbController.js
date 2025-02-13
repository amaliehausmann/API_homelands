import express from "express";
import sequelize from "../config/sequelizeConfig.js";
import { cityModel } from "../models/cityModel.js";
import { energyLabelsModel } from "../models/energyLabelsModel.js";
import { estateImageRelModel } from "../models/estateImageRelModel.js";
import { estateModel } from "../models/estateModel.js";
import { estateTypeModel } from "../models/estateTypeModel.js";
import { favoriteModel } from "../models/favoriteModel.js";
import { imageModel } from "../models/imageModel.js";
import { reviewModel } from "../models/reviewModel.js";
import { staffModel } from "../models/staffModel.js";
import { userModel } from "../models/userModel.js";
import { seedFromCsv } from "../utils/seedUtils.js";

//Opretter en router
export const dbcontroller = express.Router();

dbcontroller.get("/sync", async (req, res) => {
  try {
    const response = await sequelize.sync();
    res.send("Data successfully synchronized");
  } catch (err) {
    res.send(err);
  }
});

dbcontroller.get("/seedfromcsv", async (req, res) => {
  try {
    await seedFromCsv("city.csv", cityModel);
    await seedFromCsv("energy-label.csv", energyLabelsModel);
    await seedFromCsv("estate-image-rel.csv", estateImageRelModel);
    await seedFromCsv("estate-type.csv", estateTypeModel);
    await seedFromCsv("estate.csv", estateModel);
    await seedFromCsv("favorite.csv", favoriteModel);
    await seedFromCsv("image.csv", imageModel);
    await seedFromCsv("review.csv", reviewModel);
    await seedFromCsv("staff.csv", staffModel);
    await seedFromCsv("user.csv", userModel);

    res.send({ message: "Seeding completed" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
