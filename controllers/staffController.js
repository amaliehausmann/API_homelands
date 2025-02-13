import express from "express";
import { staffModel } from "../models/staffModel.js";
import { Authorize } from "../utils/authUtils.js";

//Opretter en router
export const staffController = express.Router();

//READ: route til at hente liste
staffController.get("/staffs", async (req, res) => {
  try {
    let data = await staffModel.findAll();
    if (!data || data.length === 0) {
      return res.status(404).json({ message: "Ingen data fundet" });
    }

    res.json(data);
  } catch (error) {
    res.status(500).send({ message: `Fejl i kald af model: ${error.message}` });
  }
});

//READ: Route til at hente detaljer
staffController.get("/staffs/:id([0-9]*)", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    let data = await staffModel.findOne({
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
staffController.post("/staffs", Authorize, async (req, res) => {
  const { firstname, lastname, position, image, phone, email } = req.body;
  if (!firstname || !lastname || !position || !image || !phone || !email) {
    return res.status(400).json({ message: "Alle felter skal sendes med" });
  }

  console.log(req.body)

  try {
    const data = await staffModel.create({
      firstname,
      lastname,
      position,
      image,
      phone,
      email,
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
staffController.put("/staffs/:id([0-9]*)", Authorize, async (req, res) => {
  const { firstname, lastname, position, image, phone, email } = req.body;

  const { id } = req.params;

  try {
    const data = await staffModel.update(
      {
        firstname,
        lastname,
        position,
        image,
        phone,
        email,
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
staffController.delete("/staffs/:id([0-9]*)", Authorize, async (req, res) => {
  const { id } = req.params;

  if (id) {
    try {
      await staffModel.destroy({
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
