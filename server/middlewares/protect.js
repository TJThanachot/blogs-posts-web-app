import jwt from "jsonwebtoken";

export const protect = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token || !token.startsWith("Bearer ")) {
    return res.json({ message: "Token has invalid format" });
  }
  const tokenWithBearer = token.split(" ")[1];

  jwt.verify(tokenWithBearer, process.env.SECRET_KEY, (err, payload) => {
    if (err) {
      return res.json({ message: "Invalid token !" });
    }
    req.user = payload;
    next();
  });
};
