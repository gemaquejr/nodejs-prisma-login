import { Router, Request, Response, NextFunction } from 'express';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import prisma from '../../config/db';

const router = Router();
const userService = new UserService(prisma);
const userController = new UserController(userService);

const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

router.get('/', asyncHandler((req: Request, res: Response) => userController.getAllUsers(req, res)));
router.post('/', asyncHandler((req: Request, res: Response) => userController.createUser(req, res)));

export default router;

