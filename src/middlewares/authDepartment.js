const jwt = require("jsonwebtoken");

const authDepartment = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization token missing" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

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
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authDepartment;
