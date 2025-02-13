import fs from "fs";
import csv from "csv-parser";
import path from "path";
import sequelize from "../config/sequelizeConfig.js";

const getCsvData = async (filename) => {
  const csvPath = path.resolve(`./data/${filename}`);
  const data = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on("data", (row) => data.push(row))
      .on("end", () => resolve(data))
      .on("error", (error) => reject(error));
  });
};

const seedFromCsv = async (filename, model) => {
  const transaction = await sequelize.transaction();

  try {
    const data = await getCsvData(filename);
    await model.bulkCreate(data, { transaction });

    await transaction.commit();
    console.log(`Seeding completed for ${filename}`);
  } catch (error) {
    await transaction.rollback();
    console.error("Seeding error:", error);
  }
};

export { getCsvData, seedFromCsv };
