import { Router, query } from "express";
import { protect } from "../middlewares/protect.js";
import { pool } from "../utils/db.js";

const blogsRouter = Router();
blogsRouter.use(protect);

// fetch all blogs ********************
blogsRouter.get("/", async (req, res) => {
  let result;
  try {
    result = await pool.query("select * from blogs");
  } catch (err) {
    return res.json({ message: "Server is error!" });
  }

  return res.json({ message: "Fetch data successfully", data: result.rows });
});

// fetch by blogId ************************
blogsRouter.get("/:blogId", async (req, res) => {
  const blogId = req.params.blogId;
  let query = "select * from blogs where blog_id = $1";
  let value = [blogId];
  let result;
  try {
    result = await pool.query(query, value);
  } catch (err) {
    return res.json({ message: "Server is error!" });
  }
  if (!result.rows[0]) {
    return res.json({ message: "Blogs has not found!" });
  }
  return res.json({ message: "Fetch data successfully", data: result.rows[0] });
});

blogsRouter.post("/createBlog", (req, res) => {
  return res.json({ message: "Create blog successfully." });
});

export default blogsRouter;
