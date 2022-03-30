import express from "express"
import cors from "cors"
import mongoose, { ConnectOptions } from "mongoose"
import morgan from "morgan"
import dotenv from "dotenv"
dotenv.config()

import authRoutes from "./routes/auth"
import applicationRoutes from "./routes/application"

const app = express()

// db connection
console.log(process.env.DATABASE_URL)

const db_url = process.env.MONGO_URL
  // process.env.NODE_ENV === "development"
  //   ? process.env.DATABASE_URL 
  //   : process.env.DATABASE_URL_LOCAL

console.log(process.env, "process.env")

mongoose
  .connect(
    db_url as string,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions
  )
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log("DB Connection Error: ", err))

// middlewares
app.use(cors())
app.use(morgan("dev"))
app.use(express.json())

// route middleware
app.use("/api", authRoutes)
app.use("/api", applicationRoutes)

const port = process.env.PORT || 8000

app.listen(port, () => console.log(`Server is running on port ${port}`))
