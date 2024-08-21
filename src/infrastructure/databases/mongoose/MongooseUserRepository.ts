import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { User } from '../../../domain/entities/User';
import { UserDocument } from './model/UserModel';
import { Model } from 'mongoose';

export class MongooseUserRepository implements IUserRepository {
  private userModel: Model<UserDocument>;

  constructor(userModel: Model<UserDocument>) {
    this.userModel = userModel;
  }

  async create(user: User): Promise<UserDocument> {
    const userModel = new this.userModel(user);
    const savedUser = await userModel.save();
    return savedUser;
  }

  async findById(id: string): Promise<User | null> {
    const userModel = await this.userModel.findById(id);
    if (!userModel) return null;
    return new User(
      userModel.id,
      userModel.username,
      userModel.email,
      userModel.password,
      userModel.createdAt,
    );
  }
  async findByEmail(email: string): Promise<UserDocument | null>{
    const userModel = await this.userModel.findOne({email:email});
    if (!userModel) return null;
    return userModel
  }

  async findAll(): Promise<User[]> {
    const users = await this.userModel.find();
    return users.map(user => new User(
      user.id,
      user.username,
      user.email,
      user.password,
      user.createdAt,
    ));
  }
}
