import { PrismaClient } from '@prisma/client';
import { RabbitMQService } from './rabbitmq.service';

interface User {
  id: string;
  username: string;
  email: string;
  password: string;
}

export class UserService {
  private prisma: PrismaClient;
  private rabbitMQ: RabbitMQService;

  constructor() {
    try {
      console.log('Initializing UserService...');
      this.prisma = new PrismaClient();
      console.log('Prisma client initialized');
      this.rabbitMQ = new RabbitMQService();
      console.log('RabbitMQ service initialized');
      this.initializeRabbitMQ();
    } catch (error) {
      console.error('Error in UserService constructor:', error);
      throw error;
    }
  }

  private async initializeRabbitMQ() {
    try {
      await this.rabbitMQ.connect();
      console.log('RabbitMQ initialized');
    } catch (error) {
      console.error('Failed to initialize RabbitMQ:', error);
    }
  }

  async createUser(username: string, email: string, password: string): Promise<User> {
    try {
      console.log('Creating user in database:', { username, email });
      
      // First check if user already exists
      const existingUser = await this.prisma.user.findFirst({
        where: {
          OR: [
            { username },
            { email }
          ]
        }
      });

      if (existingUser) {
        console.error('User already exists:', existingUser);
        throw new Error('User with this username or email already exists');
      }

      const newUser = await this.prisma.user.create({
        data: {
          username,
          email,
          password, // Note: In production, password should be hashed
        },
      });
      console.log('User created in database:', newUser);

      // Publish user created event
      try {
        await this.rabbitMQ.publish('user.created', {
          userId: newUser.id,
          username: newUser.username,
          email: newUser.email,
          timestamp: new Date().toISOString()
        });
        console.log('Event published successfully');
      } catch (mqError) {
        console.error('Failed to publish event:', mqError);
        // Don't fail the request if event publishing fails
      }

      return newUser;
    } catch (error) {
      console.error('Error creating user:', error);
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          stack: error.stack
        });
      }
      throw error;
    }
  }

  async getUserById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async getAllUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    try {
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: updates,
      });

      // Publish user updated event
      await this.rabbitMQ.publish('user.updated', {
        userId: id,
        updates,
        timestamp: new Date().toISOString()
      });

      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      return null;
    }
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      await this.prisma.user.delete({
        where: { id },
      });

      // Publish user deleted event
      await this.rabbitMQ.publish('user.deleted', {
        userId: id,
        timestamp: new Date().toISOString()
      });

      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  }
}