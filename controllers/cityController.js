import express from "express";
import { cityModel } from "../models/cityModel.js";

//Opretter en router
export const cityController = express.Router();

//READ: route til at hente liste
cityController.get("/cities", async (req, res) => {
  try {
    let data = await cityModel.findAll();
    if (!data || data.length === 0) {
      return res.status(404).json({ message: "Ingen data fundet" });
    }

    res.json(data);
  } catch (error) {
    res.status(500).send({ message: `Fejl i kald af model: ${error.message}` });
  }
});

//READ: Route til at hente detaljer
cityController.get("/cities/:id([0-9]*)", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    let data = await cityModel.findOne({
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
cityController.post("/cities", async (req, res) => {
  const { zipcode, name } = req.body;
  if (!zipcode || !name) {
    return res.status(400).json({ message: "Alle felter skal sendes med" });
  }

  try {
    const data = await cityModel.create({
      zipcode,
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
cityController.put("/cities/:id([0-9]*)", async (req, res) => {
  const { zipcode, name } = req.body;

  const { id } = req.params;

  try {
    const data = await cityModel.update(
      {
        zipcode,
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
cityController.delete("/cities/:id([0-9]*)", async (req, res) => {
  const { id } = req.params;

  if (id) {
    try {
      await cityModel.destroy({
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
