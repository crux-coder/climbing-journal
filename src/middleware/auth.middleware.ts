import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    let token;

    // 1. Check Authorization header
    const authHeader = req.headers["authorization"];
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
    // 2. Fallback to cookies
    if (!token) {
      // TODO: Implement cookie parsing
    }

    // 3. Verify token
    if (!token) {
      throw new Error("Missing or invalid authentication token.");
    }

    if (isTokenExpired(token)) {
      throw new Error("Token has expired.");
    }

    req.auth = { token };

    next();
  } catch (err) {
    if (err instanceof Error) {
      res.status(401).json({
        message: err.message,
      });
    } else {
      res.status(401).json({
        message: "Missing or invalid authentication token.",
      });
    }
  }
}

function isTokenExpired(token: string): boolean {
  // Token will always encode json with exp field
  const decoded = jwt.decode(token) as { exp: number } | null;
  if (!decoded) {
    return true;
  }

  if (decoded.exp) {
    return Date.now() >= decoded.exp * 1000;
  }

  return true;
}
