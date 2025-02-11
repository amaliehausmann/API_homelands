import express from "express";
import { estateModel } from "../models/estateModel.js";
import { cityModel } from "../models/cityModel.js";
import { estateTypeModel } from "../models/estateTypeModel.js";
import { energyLabelsModel } from "../models/energyLabelsModel.js";

//Opretter en router
export const estateController = express.Router();

estateModel.belongsTo(cityModel, {
  foreignKey: {
    allowNull: false,
  },
});

estateModel.belongsTo(estateTypeModel, {
  foreignKey: {
    allowNull: false,
  },
});

estateModel.belongsTo(energyLabelsModel, {
  foreignKey: {
    allowNull: false,
  },
});

cityModel.hasMany(estateModel);
estateTypeModel.hasMany(estateModel);
energyLabelsModel.hasMany(estateModel);

//READ: route til at hente liste
estateController.get("/estates", async (req, res) => {
  try {
    let data = await estateModel.findAll({
      include: [
        {
          model: cityModel,
          attributes: ["id", "zipcode", "name"],
        },
        {
          model: estateTypeModel,
          attributes: ["id", "name"],
        },
        {
          model: energyLabelsModel,
          attributes: ["id", "name"],
        },
      ],
    });
    if (!data || data.length === 0) {
      return res.status(404).json({ message: "Ingen data fundet" });
    }

    res.json(data);
  } catch (error) {
    res.status(500).send({ message: `Fejl i kald af model: ${error.message}` });
  }
});

//READ: Route til at hente detaljer
estateController.get("/estates/:id([0-9]*)", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    let data = await estateModel.findOne({
      where: { id: id },
      include: [
        {
          model: cityModel,
          attributes: ["id", "zipcode", "name"],
        },
        {
          model: estateTypeModel,
          attributes: ["id", "name"],
        },
        {
          model: energyLabelsModel,
          attributes: ["id", "name"],
        },
      ],
    });

    if (!data) {
      return res.status(404).json({ message: "Item ikke fundet" });
    }

    res.json(data);
  } catch (error) {
    res.status(500).send({
      message: `Fejl i kald af model: ${error.message}`,
    });
  }
});

//CREATE: Route til at oprette
estateController.post("/estates", async (req, res) => {
  const {
    address,
    price,
    payout,
    gross,
    net,
    cost,
    num_rooms,
    num_floors,
    floor_space,
    ground_space,
    basement_space,
    year_of_construction,
    year_rebuilt,
    description,
    floorplan,
    num_clicks,
    city_id: cityId,
    estate_type_id: typeId,
    energy_label_id: energyLabelId,
  } = req.body;
  if (
    !address ||
    !price ||
    !payout ||
    !gross ||
    !net ||
    !cost ||
    !num_rooms ||
    !num_floors ||
    !floor_space ||
    !ground_space ||
    !basement_space ||
    !year_of_construction ||
    !year_rebuilt ||
    !description ||
    !floorplan ||
    !num_clicks ||
    !cityId ||
    !typeId ||
    !energyLabelId
  ) {
    return res.status(400).json({ message: "Alle felter skal sendes med" });
  }

  try {
    const data = await estateModel.create({
      address,
      price,
      payout,
      gross,
      net,
      cost,
      num_floors,
      num_rooms,
      floor_space,
      ground_space,
      basement_space,
      year_of_construction,
      year_rebuilt,
      description,
      floorplan,
      num_clicks,
      cityId,
      typeId,
      energyLabelId,
    });

    res.status(201).json(data);
  } catch (error) {
    console.error("Fejl ved oprettelse:", error);
    res.status(500).send({
      message: `Fejl i oprettelse af model: ${error.message}`,
    });
  }
});

//UPDATE: Route til at opdatere
estateController.put("/estates/:id([0-9]*)", async (req, res) => {
  const {
    address,
    price,
    payout,
    gross,
    net,
    cost,
    num_rooms,
    num_floors,
    floor_space,
    ground_space,
    basement_space,
    year_of_construction,
    year_rebuilt,
    description,
    floorplan,
    num_clicks,
    city_id: cityId,
    estate_type_id: typeId,
    energy_label_id: energyLabelId,
  } = req.body;

  const { id } = req.params;

  try {
    const data = await estateModel.update(
      {
        address,
        price,
        payout,
        net,
        gross,
        cost,
        num_rooms,
        num_floors,
        floor_space,
        ground_space,
        basement_space,
        year_of_construction,
        year_rebuilt,
        description,
        floorplan,
        num_clicks,
        cityId,
        typeId,
        energyLabelId,
      },
      { where: { id: id } }
    );

    if (data[0] > 0) {
      res.status(200).send({ message: "Item opdateret succesfuldt" });
    } else {
      res.status(404).send({ message: "Item ikke fundet" });
    }
  } catch (error) {
    res.status(500).send({
      message: `Fejl ved opdatering af model: ${error.message}`,
    });
  }
});

//DELETE: Route til at slette
estateController.delete("/estates/:id([0-9]*)", async (req, res) => {
  const { id } = req.params;

  if (id) {
    try {
      await estateModel.destroy({
        where: { id: id },
      });

      res.status(200).send({
        message: "Rækken er slettet",
      });
    } catch (error) {
      res.status(500).send({
        message: `Kunne ikke slette item: ${error.message}`,
      });
    }
  } else {
    res.status(400).send({
      message: "Id er ugyldigt",
    });
  }
});
