import { Router } from "express";
import { protect } from "../middlewares/protect.js";
import { pool } from "../utils/db.js";

const commentRouter = Router();
// commentRouter.use(protect);

commentRouter.get("/:blogId/comments", async (req, res) => {
  const blogId = req.params.blogId;
  let query = `select * from comments where blog_id = $1`;
  let value = [blogId];
  try {
    const result = await pool.query(query, value);
  } catch (err) {
    console.log(err);
  }
  return res.json({ message: "fetch all of comments successfully" });
});

commentRouter.post("/:blogId/comments", async (req, res) => {
  const created_at = new Date().toISOString();
  const updated_at = new Date().toISOString();
  const blogId = req.params.blogId;

  const comment = { ...req.body, blogId, created_at, updated_at };
  let query = `insert into comments(user_id,content,blog_id,created_at, updated_at)values($1,$2,$3,$4,$5)`;
  let value = Object.values(comment);
  try {
    const result = await pool.query(query, value);
  } catch (err) {
    console.log(err);
  }
  return res.json({ message: "Created comment successfully." });
});

commentRouter.put("/:blogId/comments/:commentId", async (req, res) => {
  const updated_at = new Date().toISOString();
  const blogId = req.params.blogId;
  const commentId = req.params.commentId;

  const comment = { ...req.body, updated_at, blogId, commentId };
  let query = `update comments set content = $1, updated_at = $2 where blog_id = $3 and comment_id = $4`;
  let value = Object.values(comment);
  try {
    const result = await pool.query(query, value);
  } catch (err) {
    console.log(err);
  }
  return res.json({ message: "Update comment successfully." });
});

commentRouter.delete("/:blogId/comments/:commentId", async (req, res) => {
  const commentId = req.params.commentId;
  let query = `delete from comments where comment_id = $1`;
  let value = [commentId];
  try {
    const result = await pool.query(query, value);
  } catch (err) {
    console.log(err);
  }
  return res.json({ message: "Delete comment successfully." });
});
export default commentRouter;
