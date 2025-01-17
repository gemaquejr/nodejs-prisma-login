import prisma from '../../config/db.js';

class UserService {
  static async getAllUsers() {
    return await prisma.user.findMany({
      select: { id: true, email: true, role: true },
    });
  }

  static async createUser(email, password, role = 'USER') {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error('Usuário já existe');
    }
    return await prisma.user.create({
      data: { email, password, role },
    });
  }

  static async createDefaultAdmin() {
    const admin = await prisma.user.findUnique({
      where: { email: 'admin@teste.com' },
    });
    if (!admin) {
      await prisma.user.create({
        data: { email: 'admin@teste.com', password: 'Admin123!', role: 'ADMIN' },
      });
      console.log('Administrador padrão criado!');
    }
  }
}

export default UserService;
