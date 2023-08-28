import { Router, query } from "express";
import { pool } from "../utils/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const authRouter = Router();

authRouter.post("/register", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const firstname = req.body.firstName;
  const lastname = req.body.lastName;
  const created_at = new Date().toISOString();
  const updated_at = new Date().toISOString();
  // error condition **************************
  if (!username || !password || !firstname || !lastname) {
    return res.status(400).json({ message: "please fill in the blank" });
  }

  const user = {
    username,
    password,
    firstname,
    lastname,
    created_at,
    updated_at,
  };
  // insert salt to password ***********************
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);
  try {
    const query =
      "insert into users(username, password, first_name, last_name,created_at,updated_at) values($1,$2,$3,$4,$5,$6)";
    const value = Object.values(user);
    //   send request to data base *******************
    await pool.query(query, value);
  } catch (err) {
    res.json({ message: "Server is error !" });
  }

  res.json({ message: "Create account successfully." });
});

authRouter.post("/login", async (req, res) => {
  const query = "select * from users where username = $1";
  const value = [req.body.username];
  let user;
  let result;
  try {
    //   send request to data base *******************
    user = await pool.query(query, value);
    result = user.rows[0];
  } catch (err) {
    res.json({
      message: "Server is error!",
    });
  }
  // validate condition **************************
  if (!user.rows[0]) {
    return res.status(404).json({ message: "User is not found" });
  }
  const validPassword = await bcrypt.compare(
    req.body.password,
    user.rows[0].password
  );
  if (!validPassword) {
    return res.status(404).json({ message: "Invalid password !" });
  }
  // create token *********************************
  const token = await jwt.sign(
    {
      username: result.username,
      firstName: result.first_name,
      lastName: result.lastName,
    },
    process.env.SECRET_KEY,
    {
      expiresIn: 900000,
    }
  );
  return res.json({ message: "Login successfully", token });
});

export default authRouter;
