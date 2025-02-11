import express from "express";
import dotenv from "dotenv";
import { dbcontroller } from "./controllers/dbController.js";
import { cityController } from "./controllers/cityController.js";
import { estateTypeController } from "./controllers/estateTypeController.js";
import { staffController } from "./controllers/staffController.js";
import { userController } from "./controllers/userController.js";
import { estateController } from "./controllers/estateController.js";

dotenv.config();

const app = express();
const port = process.env.SERVERPORT || 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World");
  console.log("Hello World from the console");
});

app.use(dbcontroller);
app.use(cityController);
app.use(estateTypeController);
app.use(staffController);
app.use(userController);
app.use(estateController);

app.listen(port, () => {
  console.log(`Server runs at http://localhost:${port}`);
});

app.get("*", (req, res) => {
  res.send("Could not find file");
});
