import express from "express";
import dotenv from "dotenv";
import "./schedular1.js"

dotenv.config();

const port = process.env.PORT || 4000;

const app = express();

app.use(express.json());

app.listen(port, () => {
  console.log(`server is running on port: ${port}`);
});



