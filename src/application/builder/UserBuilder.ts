// src/application/builders/UserBuilder.ts
import mongoose, { ObjectId } from 'mongoose';
import { User } from '../../domain/entities/User';

export class UserBuilder {
  private id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId();
  private username: string = '';
  private email: string = '';
  private password: string = '';
  private createdAt: Date = new Date();

  public setId(id: mongoose.Types.ObjectId): this {
    this.id = id;
    return this;
  }

  public setUsername(username: string): this {
    this.username = username;
    return this;
  }

  public setEmail(email: string): this {
    this.email = email;
    return this;
  }

  public setPassword(password: string): this {
    this.password = password;
    return this;
  }

  public setCreatedAt(createdAt: Date): this {
    this.createdAt = createdAt;
    return this;
  }

  public build(): User {
    return new User(this.id, this.username, this.email, this.password, this.createdAt);
  }
}