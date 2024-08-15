import { Request, Response, NextFunction } from "express";
import { Server } from "../../infrastructure/server/Server";
import { NotFoundError } from "../errors/NotFoundError";
import { UserUseCase } from "../../application/use-cases/userUseCase";
import { IUserUseCase } from "../../application/interface/IUserUseCase";
import { ExpressRequestInterface } from "../interface/ExpressRequestInterface";
import { UnAuthorizedError } from "../errors/UnAuthorizedError";

export class UserController {
  constructor(private userUseCase: IUserUseCase, private server: Server) {}

  async createUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { username, email, password } = req.body;

    const savedUser = await this.userUseCase.createUser({
      username,
      email,
      password,
    });

    //this.server.emitEvent("userCreated", { username, email });

    res
      .status(201)
      .send({
        email: savedUser.email,
        username: savedUser.username,
        id: savedUser._id,
        token: savedUser.token,
      });
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { email, password } = req.body;

    const loginUser = await this.userUseCase.loginUser(email, password);

    res
      .status(201)
      .send({
        id: loginUser._id,
        email: loginUser.email,
        username: loginUser.username,
        token: loginUser.token,
      });
  }

  async getUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const user = await this.userUseCase.getUser(req.params.id);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    res.status(200).json(user);
  }

  async currentUser(
    req: ExpressRequestInterface,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    if (!req.user) {
      throw new UnAuthorizedError("Unauthorized Access");
    }
    const token = await this.userUseCase.generateJwt(
      req.user._id,
      req.user.email
    );
    res
      .status(200)
      .json({
        id: req.user._id,
        email: req.user.email,
        username: req.user.email,
        token: token,
      });
  }
}
