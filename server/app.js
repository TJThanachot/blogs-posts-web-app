import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import authRouter from "./apps/auth.js";
import blogsRouter from "./apps/blogs.js";
import commentRouter from "./apps/comments.js";
import dotenv from "dotenv";

async function init() {
  const app = express();
  const port = 4000;
  dotenv.config();

  app.use(cors());
  app.use(bodyParser.json());
  app.use("/auth", authRouter);
  app.use("/blogs", blogsRouter);
  app.use("/blogs", commentRouter);

  app.get("/", (req, res) => {
    res.status(404).send({ message: "Welcome !" });
  });

  app.get("*", (req, res) => {
    res.status(404).send({ message: "Not found!" });
  });

  app.listen(port, () => {
    console.log(`Server is listening on ${port}`);
  });
}

init();
