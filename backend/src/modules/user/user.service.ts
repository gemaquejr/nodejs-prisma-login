import { PrismaClient, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { IUser } from './user.interface';

export class UserService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findAllUsers(): Promise<IUser[]> {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
      },
    });
  }

  async createDefaultAdmin(): Promise<void> {
    const admin = await this.prisma.user.findUnique({
      where: { email: 'admin@teste.com' },
    });

    if (!admin) {
      const hashedPassword = await bcrypt.hash('Admin123!', 10);
      await this.prisma.user.create({
        data: {
          email: 'admin@teste.com',
          password: hashedPassword,
          role: 'ADMIN',
        },
      });
      console.log('Administrador criado com sucesso!');
    }
  }

  async createUser(email: string, password: string): Promise<User> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'USER',
      },
    });
    return user;
  }
}
