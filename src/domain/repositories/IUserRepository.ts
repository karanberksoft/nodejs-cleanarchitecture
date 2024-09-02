import { User } from '../entities/User';
import { UserDocument } from '../../infrastructure/databases/mongoose/model/UserModel';
export interface IUserRepository {
  create(user: User): Promise<UserDocument>;
  findById(id: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  findByEmail(email: string): Promise<UserDocument | null>;
  findByRefreshToken(refreshToken: string): Promise<UserDocument | null>;
}