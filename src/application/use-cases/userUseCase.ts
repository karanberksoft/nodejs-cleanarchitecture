import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { User } from "../../domain/entities/User";
import mongoose, { ObjectId } from "mongoose";
import { UserDocument } from "../../infrastructure/databases/mongoose/model/UserModel";
import jwt from "jsonwebtoken";
import { IUserUseCase } from "../interface/IUserUseCase";
import { NotFoundError } from "../../interfaces/errors/NotFoundError";
import bcryptjs from "bcryptjs";
import { BadRequestError } from "../../interfaces/errors/BadRequestError";
import { UserBuilder } from "../builder/UserBuilder";

export class UserUseCase implements IUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async createUser(
    userData: Omit<User, "id" | "createdAt">
  ): Promise<Omit<UserDocument, "token"> & { token: string }> {
    const user = new UserBuilder()
      .setUsername(userData.username)
      .setEmail(userData.email)
      .setPassword(userData.password)
      .setCreatedAt(new Date())
      .build();

    const savedUser = await this.userRepository.create(user);
    const userToken = await this.generateJwt(new mongoose.Types.ObjectId(savedUser._id),savedUser.email);

    const userWithoutSensitiveData = savedUser.toObject();

    return { ...userWithoutSensitiveData, token: userToken };
  }

  async getUser(userId: string): Promise<User | null> {
    const user = await this.userRepository.findById(userId);
    return user ? user : null;
  }
  async loginUser(
    email: string,
    password: string
  ): Promise<Omit<UserDocument, "token"> & { token: string }> {
    const loginUser = await this.userRepository.findByEmail(email);
    if (loginUser == null) {
      throw new NotFoundError("user not found");
    }
    const isSamePassword = this.comparePassword(password, loginUser.password);
    if (!isSamePassword) {
      throw new BadRequestError("Incorrect email or password");
    }
    const userToken = await this.generateJwt(loginUser.id,loginUser.email);
    return {...loginUser.toObject(),token:userToken};
  }

  async comparePassword(
    password: string,
    hashPassword: string
  ): Promise<Boolean> {
    return bcryptjs.compare(password, hashPassword);
  }
  async generateJwt(id: mongoose.Types.ObjectId, email: string):Promise<string> {
    return jwt.sign({ id: id, email: email }, process.env.JWT_SECRET as string);
  }
}
