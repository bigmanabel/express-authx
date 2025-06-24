import { Request, Response, NextFunction } from "express";
import Boom from "@hapi/boom";
import { JwtService } from "../services/jwt.service";
import { ActiveUserData } from "../interfaces/active-user-data.interface";

// Extend Request interface to include user data
declare global {
  namespace Express {
    interface Request {
      user?: ActiveUserData;
    }
  }
}

const jwtService = new JwtService();

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw Boom.unauthorized("Access token is required");
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    try {
      const payload = await jwtService.verify<ActiveUserData>(token);
      req.user = payload;
      next();
    } catch (error) {
      throw Boom.unauthorized("Invalid or expired token");
    }
  } catch (error) {
    next(error);
  }
}

export function requireRole(role: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(Boom.unauthorized("Authentication required"));
    }

    if (req.user.role !== role) {
      return next(Boom.forbidden("Insufficient permissions"));
    }

    next();
  };
}
