import express from "express";
import { reviewModel } from "../models/reviewModel.js";
import { userModel } from "../models/userModel.js";
import { estateModel } from "../models/estateModel.js";
import { Authorize } from "../utils/authUtils.js";

//Opretter en router
export const reviewController = express.Router();

reviewModel.belongsTo(userModel, {
  foreignKey: {
    allowNull: false,
  },
});
reviewModel.belongsTo(estateModel, {
  foreignKey: {
    allowNull: false,
  },
});

estateModel.hasMany(reviewModel);
userModel.hasMany(reviewModel);

//READ: route til at hente liste
reviewController.get("/reviews", async (req, res) => {
  try {
    let data = await reviewModel.findAll({
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
reviewController.get("/reviews/:id([0-9]*)", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    let data = await reviewModel.findOne({
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
reviewController.post("/reviews", Authorize, async (req, res) => {
  const {
    user_id: userId,
    estate_id: estateId,
    subject,
    comment,
    num_stars,
    date,
    is_active,
  } = req.body;
  if (!userId || !estateId) {
    return res.status(400).json({ message: "Alle felter skal sendes med" });
  }

  try {
    const data = await reviewModel.create({
      userId,
      estateId,
      subject,
      comment,
      num_stars,
      date,
      is_active,
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
reviewController.put("/reviews/:id([0-9]*)", Authorize, async (req, res) => {
  const {
    estate_id: estateId,
    user_id: userId,
    subject,
    comment,
    num_stars,
    date,
    is_active,
  } = req.body;

  const { id } = req.params;

  try {
    const data = await reviewModel.update(
      {
        estateId,
        userId,
        subject,
        comment,
        num_stars,
        date,
        is_active,
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
reviewController.delete("/reviews/:id([0-9]*)", Authorize, async (req, res) => {
  const { id } = req.params;

  if (id) {
    try {
      await reviewModel.destroy({
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
