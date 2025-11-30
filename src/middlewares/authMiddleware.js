import { loadData } from "../utils/helpers.js";

export const authenticate = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  const data = loadData();
  const user = data.users.find((u) => u.token === token);
  if (!user) {
    return res.status(401).json({ error: "Invalid token" });
  }

  req.user = user;
  next();
};

export const authorize = (permissions) => {
  return (req, res, next) => {
    const data = loadData();
    const userRole = data.roles.find((role) => role.id === req.user.role_id);

    if (!userRole) {
      return res.status(403).json({ error: "Role not found" });
    }

    const hasPermission = permissions.some((permission) =>
      userRole.permissions.includes(permission)
    );

    if (!hasPermission) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }

    next();
  };
};
