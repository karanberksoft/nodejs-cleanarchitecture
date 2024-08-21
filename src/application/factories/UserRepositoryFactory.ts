// src/application/factories/UserRepositoryFactory.ts
import { Model } from 'mongoose';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { MongooseUserRepository } from '../../infrastructure/databases/mongoose/MongooseUserRepository';
import { UserDocument } from '../../infrastructure/databases/mongoose/model/UserModel';

export class UserRepositoryFactory {
  public static create(userModel: Model<UserDocument>): IUserRepository {
    return new MongooseUserRepository(userModel);
  }
}