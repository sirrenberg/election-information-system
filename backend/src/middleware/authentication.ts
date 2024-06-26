import { NextFunction } from "express";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

async function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // get token from header
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  // check if token exists
  if (token == null)
    return res.status(401).send({ error: "No token provided" });

  // verify token
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err, user) => {
    if (err) return res.status(403).send({ error: "Invalid token" });

    req.user = user;

    next();
  });
}

export { authenticateToken };
