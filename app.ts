import express from "express";
import { readdirSync } from "fs";
import cors from "cors";
import mongoose, { ConnectOptions } from "mongoose"
const morgan = require("morgan");
import 'dotenv/config';

const app = express();

// db connection
console.log(process.env.DATABASE_URL);

const db_url =
  process.env.NODE_ENV === "development"
    ? process.env.DATABASE_URL_LOCAL
    : process.env.DATABASE_URL

mongoose
  .connect(db_url as string, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions)
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log("DB Connection Error: ", err));

// middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// route middleware
readdirSync("./routes").map((r) => app.use("/api", require(`./routes/${r}`)));

const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Server is running on port ${port}`));
