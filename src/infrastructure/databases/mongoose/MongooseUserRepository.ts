import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { User } from '../../../domain/entities/User';
import { UserModel,UserDocument } from './model/UserModel';

export class MongooseUserRepository implements IUserRepository {
  async create(user: User): Promise<UserDocument> {
    const userModel = new UserModel(user);
    const savedUser = await userModel.save();
    return savedUser;
  }

  async findById(id: string): Promise<User | null> {
    const userModel = await UserModel.findById(id);
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
    const userModel = await UserModel.findOne({email:email});
    if (!userModel) return null;
    return userModel
  }

  async findAll(): Promise<User[]> {
    const users = await UserModel.find();
    return users.map(user => new User(
      user.id,
      user.username,
      user.email,
      user.password,
      user.createdAt,
    ));
  }
}
