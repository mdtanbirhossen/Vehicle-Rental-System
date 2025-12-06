import { NextFunction, Request, Response } from "express";

const selfOrAdminAuth = () => {
  return async (req: Request, res: Response, next: NextFunction) => {

    try {
      const decodedUser = req.user;
      console.log(decodedUser);
      if (!decodedUser) {
        return res.status(401).json({
          success: false,
          message: "You do not have permission to access this resource",
        });
      }
      console.log(decodedUser.role !== "admin" && decodedUser.id !== req.params.id)
      // Role-based access control
      if (decodedUser.role !== "admin" && decodedUser.id !== req.params.id) {
        return res.status(403).json({
          success: false,
          message: "You do not have permission to access this resource",
        });
      }

      next();
    } catch (err: any) {
      res.status(401).json({
        success: false,
        message: "You do not have permission to access this resource",
        error: err.message,
      });
    }
  };
};

export default selfOrAdminAuth;
