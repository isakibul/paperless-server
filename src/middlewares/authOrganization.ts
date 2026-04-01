import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface OrganizationJwtPayload {
  id: string;
  organizationUsername: string;
}

interface AuthenticatedRequest extends Request {
  user?: OrganizationJwtPayload;
}

const authOrganization = (
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

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as OrganizationJwtPayload;

    /**
     * attach org info to request
     */
    req.user = {
      id: decoded.id,
      organizationUsername: decoded.organizationUsername,
    };

    next();
  } catch (err) {
    console.error("Auth Error:", err);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default authOrganization;
