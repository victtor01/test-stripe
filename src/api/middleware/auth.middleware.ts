import type { NextFunction, Request, Response } from "express";

const AuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader === "123456") {
    return next(); // Sucesso: vai para o controller
  }

  res.status(401).json({ error: "Unauthorized" });
};


export { AuthMiddleware };
