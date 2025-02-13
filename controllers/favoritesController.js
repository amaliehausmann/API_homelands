import express from "express";
import { favoriteModel } from "../models/favoriteModel.js";
import { userModel } from "../models/userModel.js";
import { estateModel } from "../models/estateModel.js";
import { Authorize } from "../utils/authUtils.js";

//Opretter en router
export const favoritesController = express.Router();
favoriteModel.belongsTo(userModel, {
  foreignKey: {
    allowNull: false,
  },
});
favoriteModel.belongsTo(estateModel, {
  foreignKey: {
    allowNull: false,
  },
});

estateModel.hasMany(favoriteModel);
userModel.hasMany(favoriteModel);

//READ: route til at hente liste
favoritesController.get("/favorites", Authorize, async (req, res) => {
  try {
    let data = await favoriteModel.findAll({
      include: [
        {
          model: userModel,
          attributes: ["id", "firstname", "lastname", "email"],
        },
        {
          model: estateModel,
          attributes: [
            "id",
            "address",
            "price",
            "payout",
            "gross",
            "net",
            "cost",
            "num_rooms",
            "num_floors",
            "floor_space",
            "ground_space",
            "basement_space",
            "year_of_construction",
            "year_rebuilt",
            "description",
            "floorplan",
            "num_clicks",
            "city_id",
            "estate_type_id",
            "energy_label_id",
          ],
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
favoritesController.get("/favorites/:id([0-9]*)", Authorize, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    let data = await favoriteModel.findOne({
      where: { id: id },
      include: [
        {
          model: userModel,
          attributes: ["id", "firstname", "lastname", "email"],
        },
        {
          model: estateModel,
          attributes: [
            "id",
            "address",
            "price",
            "payout",
            "gross",
            "net",
            "cost",
            "num_rooms",
            "num_floors",
            "floor_space",
            "ground_space",
            "basement_space",
            "year_of_construction",
            "year_rebuilt",
            "description",
            "floorplan",
            "num_clicks",
            "city_id",
            "estate_type_id",
            "energy_label_id",
          ],
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
favoritesController.post("/favorites", Authorize, async (req, res) => {
  const { user_id: userId, estate_id: estateId } = req.body;
  if (!userId || !estateId) {
    return res.status(400).json({ message: "Alle felter skal sendes med" });
  }

  try {
    const data = await favoriteModel.create({
      userId,
      estateId,
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
favoritesController.put("/favorites/:id([0-9]*)", Authorize, async (req, res) => {
  const { estate_id: estateId, user_id: userId } = req.body;

  const { id } = req.params;

  try {
    const data = await favoriteModel.update(
      {
        estateId,
        userId,
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
favoritesController.delete("/favorites/:id([0-9]*)", Authorize, async (req, res) => {
  const { id } = req.params;

  if (id) {
    try {
      await favoriteModel.destroy({
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
