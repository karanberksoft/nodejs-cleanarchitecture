import { Server } from './infrastructure/server/Server';
import { UserController } from './interfaces/controllers/UserController';
import { UserRoutes } from './interfaces/routes/UserRoutes';
import { MongooseUserRepository } from './infrastructure/databases/mongoose/MongooseUserRepository';
import { connectToMongoDB } from './config/MongooseConfig';
import 'express-async-errors';
import dotenv from 'dotenv';
import { UserUseCase } from './application/use-cases/userUseCase';

dotenv.config();

const startApplication = async () => {
  await connectToMongoDB(process.env.MONGODB_URI as string);
  const port = process.env.PORT ? parseInt(process.env.PORT) : 5001;
  const userRepository = new MongooseUserRepository();
  const userUseCase = new UserUseCase(userRepository);

  const userController = new UserController(userUseCase, null as any);
  const userRoutes = new UserRoutes(userController);

  const server = new Server(port, userRoutes);
  userController['server'] = server;  // Inject server after initialization
  server.start();
};

startApplication().catch((error) => console.error('Error starting application:', error));
