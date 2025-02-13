import express from "express";
import { userModel } from "../models/UserModel.js";
import { Authorize } from "../utils/authUtils.js";

//Opretter en router
export const userController = express.Router();

//READ: route til at hente liste
userController.get("/users", Authorize, async (req, res) => {
  try {
    let data = await userModel.findAll();
    if (!data || data.length === 0) {
      return res.status(404).json({ message: "Ingen data fundet" });
    }

    res.json(data);
  } catch (error) {
    res.status(500).send({ message: `Fejl i kald af model: ${error.message}` });
  }
});

//READ: Route til at hente detaljer
userController.get("/users/:id([0-9]*)", Authorize, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    let data = await userModel.findOne({
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
userController.post("/users", async (req, res) => {
  const { firstname, lastname, email, password, refresh_token, is_active } =
    req.body;
  if (
    !firstname ||
    !lastname ||
    !password ||
    !refresh_token ||
    !is_active ||
    !email
  ) {
    return res.status(400).json({ message: "Alle felter skal sendes med" });
  }

  console.log(req.body);

  try {
    const data = await userModel.create({
      firstname,
      lastname,
      email,
      password,
      refresh_token,
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
userController.put("/users/:id([0-9]*)", Authorize, async (req, res) => {
  const { firstname, lastname, email, password, refresh_token, is_active } =
    req.body;

  const { id } = req.params;

  try {
    const data = await userModel.update(
      {
        firstname,
        lastname,
        email,
        password,
        refresh_token,
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
userController.delete("/users/:id([0-9]*)", Authorize, async (req, res) => {
  const { id } = req.params;

  if (id) {
    try {
      await userModel.destroy({
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
