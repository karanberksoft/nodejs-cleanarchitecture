
import mongoose from 'mongoose';
import { User } from '../../domain/entities/User';
import { UserDocument } from '../../infrastructure/databases/mongoose/model/UserModel';
export interface IUserUseCase {
  createUser(userData: Omit<User, "id" | "createdAt">): Promise<Omit<UserDocument, "token"> & { token: string }> ;
  getUser(userId: string): Promise<User | null>;
  loginUser(email:string,password:string):Promise<Omit<UserDocument, "token"> & { token: string }>;
  comparePassword(password:string,hashPassword:string):Promise<Boolean>;
  generateJwt(id: mongoose.Types.ObjectId, email: string):Promise<string>; 
}