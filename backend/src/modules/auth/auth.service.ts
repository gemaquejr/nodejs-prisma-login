import bcrypt from 'bcrypt';
import prisma from '../../config/db';
import { createToken } from './auth.middleware';
import { Role } from '@prisma/client';

class AuthService {
  static async login(email: string, password: string): Promise<string> {
    const user = await prisma.user.findUnique({
      where: { email },
   });

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new Error('Senha incorreta');
    }
    return createToken(user.email);
  }

  static async register(email: string, password: string, role: Role): Promise<void> {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      throw new Error('Usuário já registrado');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: { email, password: hashedPassword, role },
    });
  }
}

export default AuthService;
