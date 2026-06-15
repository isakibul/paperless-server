import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import env from "../config/env";

interface DepartmentJwtPayload {
  id: string;
  departmentUsername: string;
  organizationId: string;
}

interface AuthenticatedRequest extends Request {
  user?: DepartmentJwtPayload;
}

const authDepartment = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "Authorization token missing" });
      return;
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, env.jwtSecret) as DepartmentJwtPayload;

    /**
     * attach dept info to request
     */
    req.user = {
      id: decoded.id,
      departmentUsername: decoded.departmentUsername,
      organizationId: decoded.organizationId,
    };

    next();
  } catch (err) {
    console.error("Department Auth Error:", err);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default authDepartment;
