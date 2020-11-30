import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

const protect = asyncHandler(async (req, res, next) => {
  let token;
  let auth = req.headers.authorization;

  if (auth && auth.startsWith("Bearer")) {
    try {
      token = auth.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      console.error(error);
      res.status(401);

      throw new Error("Not authorized, token is invalid!");
    }
  }

  if (!token) {
    res.status(404);
    throw new Error("Not authorized, no token!");
  }
});

const checkAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized as an Admin.");
  }
};

export { protect, checkAdmin };
