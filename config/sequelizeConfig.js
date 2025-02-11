import { Sequelize } from "sequelize";
import dotenv from "dotenv";

//Giver adgang til variabler fra en .env-fil via process.env
dotenv.config();

if (
  !process.env.DBNAME ||
  !process.env.DBUSER ||
  !process.env.DBPASSWORD ||
  !process.env.DBHOST
) {
  console.error(
    "Error: Can not connect to database because of missing credentials"
  );
  process.exit(1);
}
const sequelize = new Sequelize(
  //Databasems navn
  process.env.DBNAME,

  //Brugernavn til databasen
  process.env.DBUSER,

  //Adgangskode til database
  process.env.DBPASSWORD,
  {
    //Database-serverens addresse
    host: process.env.DBHOST,

    //Porten databasen kører på
    port: process.env.DBPORT || 3306,

    //Databasetype (MySQL)
    dialect: "mysql",
  }
);

sequelize
  .authenticate()
  .then(() => console.log("Connection to database established"))
  .catch((err) => console.error(`Could not connect to database: ${err}`));

export default sequelize;
