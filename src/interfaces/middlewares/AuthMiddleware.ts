import { NextFunction, Response,Request } from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "../../infrastructure/databases/mongoose/model/UserModel";
import { ExpressRequestInterface } from "../interface/ExpressRequestInterface";
import { UnAuthorizedError } from "../errors/UnAuthorizedError";



export const AuthMiddleware = async (
  req: ExpressRequestInterface,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        throw new UnAuthorizedError("Unauthorized Access")
    }
    const token = authHeader.split(" ")[1];
    const data = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string; email: string };
    const user = await UserModel.findById(data.id);

    if (!user) {
      throw new UnAuthorizedError("Unauthorized Access")
    }

    req.user = user;
    next();
  } catch (err) {
    throw new UnAuthorizedError("Unauthorized Access")
  }
};
