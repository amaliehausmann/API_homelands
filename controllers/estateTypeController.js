import express from "express";
import { estateTypeModel } from "../models/estateTypeModel.js";
import { Authorize } from "../utils/authUtils.js";

//Opretter en router
export const estateTypeController = express.Router();

//READ: route til at hente liste
estateTypeController.get("/estate_types", async (req, res) => {
  try {
    let data = await estateTypeModel.findAll();
    if (!data || data.length === 0) {
      return res.status(404).json({ message: "Ingen data fundet" });
    }

    res.json(data);
  } catch (error) {
    res.status(500).send({ message: `Fejl i kald af model: ${error.message}` });
  }
});

//READ: Route til at hente detaljer
estateTypeController.get("/estate_types/:id([0-9]*)", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    let data = await estateTypeModel.findOne({
      where: { id: id },
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
estateTypeController.post("/estate_types", Authorize, async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: "Alle felter skal sendes med" });
  }

  try {
    const data = await estateTypeModel.create({
      name,
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
estateTypeController.put("/estate_types/:id([0-9]*)", Authorize, async (req, res) => {
  const { name } = req.body;

  const { id } = req.params;

  try {
    const data = await estateTypeModel.update(
      {
        name,
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
estateTypeController.delete("/estate_types/:id([0-9]*)", Authorize, async (req, res) => {
  const { id } = req.params;

  if (id) {
    try {
      await estateTypeModel.destroy({
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
