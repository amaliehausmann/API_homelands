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
    const forceSync = req.query.force === 'true';
    const response = await sequelize.sync({force: forceSync});
    res.send(`Data successfully synchronized ${forceSync ? 'with force' : 'without force'}`);
  } catch (err) {
    res.send(err);
  }
});

dbcontroller.get("/seedfromcsv", async (req, res) => {
  try {
    await seedFromCsv("staff.csv", staffModel);
    await seedFromCsv("user.csv", userModel);
    await seedFromCsv("city.csv", cityModel);
    await seedFromCsv("energy-label.csv", energyLabelsModel);
    await seedFromCsv("estate-type.csv", estateTypeModel);
    await seedFromCsv("image.csv", imageModel);
    await seedFromCsv("estate.csv", estateModel);
    await seedFromCsv("estate-image-rel.csv", estateImageRelModel);
    await seedFromCsv("favorite.csv", favoriteModel);
    await seedFromCsv("review.csv", reviewModel);

    res.send({ message: "Seeding completed" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
