import express from "express";
import { favoriteModel } from "../models/favoriteModel.js";
import { userModel } from "../models/userModel.js";
import { estateModel } from "../models/estateModel.js";
import { Authorize } from "../utils/authUtils.js";
import { imageModel } from "../models/imageModel.js";
import { estateImageRelModel } from "../models/estateImageRelModel.js";

//Opretter en router
export const favoritesController = express.Router();

estateModel.belongsToMany(imageModel, { through: estateImageRelModel });
imageModel.belongsToMany(estateModel, { through: estateImageRelModel });

estateModel.belongsToMany(userModel, { through: favoriteModel });
userModel.belongsToMany(estateModel, { through: favoriteModel });

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

//READ: Route til at hente liste af favorites baseret på user_id
favoritesController.get(
  "/favorites/:user_id([0-9]*)",
  Authorize,
  async (req, res) => {
    try {
      const user_id = parseInt(req.params.user_id, 10);

      const data = await favoriteModel.findAll({
        where: { user_id: user_id },
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
            include: [
              {
                model: imageModel,
                attributes: ["id", "filename", "description", "author"],
                required: false, 
              },
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
  }
);

//CREATE: Route til at oprette
favoritesController.post("/favorites", Authorize, async (req, res) => {
  const { user_id, estate_id } = req.body; 
  
  console.log(req.body); 

  if (!user_id || !estate_id) {
    return res.status(400).json({ message: "Alle felter skal sendes med" });
  }

  try {
    const data = await favoriteModel.create({
      user_id, 
      estate_id,
    });

    res.status(201).json(data);
  } catch (error) {
    console.error("Fejl ved oprettelse:", error);
    res.status(500).send({
      message: `Fejl i oprettelse af model: ${error.message}`,
    });
  }
});


//DELETE: Route til at slette
favoritesController.delete(
  "/favorites/:id([0-9]*)",
  Authorize,
  async (req, res) => {
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
  }
);
