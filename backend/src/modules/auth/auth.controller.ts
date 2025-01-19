import { Request, Response } from 'express';
import AuthService from './auth.service';

class AuthController {
  static async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email e senha são obrigatórios' });
      return;
    }

    try {
      const token = await AuthService.login(email, password);
      res.status(200).json({ token });
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  }

  static async register(req: Request, res: Response): Promise<void> {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      res.status(400).json({ message: 'Email, senha e papel são obrigatórios' });
      return;
    }

    try {
      await AuthService.register(email, password, role);
      res.status(201).json({ message: 'Usuário registrado com sucesso' });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

export default AuthController;
