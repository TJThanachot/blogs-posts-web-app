import { Router, query } from "express";
import { protect } from "../middlewares/protect.js";
import { pool } from "../utils/db.js";

const blogsRouter = Router();
// blogsRouter.use(protect);

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

blogsRouter.post("/createBlog", async (req, res) => {
  const created_at = new Date().toISOString();
  const updated_at = new Date().toISOString();
  const blog = { ...req.body, created_at, updated_at };

  let query = `insert into blogs(title,tag,content,user_id,created_at,updated_at)
  values($1,$2,$3,$4,$5,$6)`;
  let value = Object.values(blog);
  try {
    const result = await pool.query(query, value);
    if (!result) {
      return res.json({ message: "invalid query" });
    }
  } catch (err) {
    console.log(err);
  }

  return res.json({ message: "Create blog successfully." });
});

blogsRouter.put("/updateBlog/:blogId", async (req, res) => {
  const blogId = req.params.blogId;

  const updated_at = new Date().toISOString();
  const blog = { ...req.body, updated_at, blogId };

  let query = `update blogs set title = $1, tag = $2, content = $3, updated_at = $4 where blog_id = $5`;
  let value = Object.values(blog);
  try {
    const result = await pool.query(query, value);
    if (!result) {
      return res.json({ message: "invalid query" });
    }
  } catch (err) {
    console.log(err);
  }

  return res.json({ message: "Update blog successfully." });
});

blogsRouter.delete("/:blogId", async (req, res) => {
  const blogId = req.params.blogId;
  let query = `delete from blogs where blog_id = $1`;
  let value = Object.values(blogId);
  try {
    const result = await pool.query(query, value);
    if (!result) {
      return res.json({ message: "invalid query" });
    }
  } catch (err) {
    console.log(err);
  }

  return res.json({ message: "Delete blog successfully." });
});

export default blogsRouter;
