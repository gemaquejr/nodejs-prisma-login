import request from 'supertest';
import express, { Application } from 'express';
import userRouter from '../user/user.routes';

const app: Application = express();
app.use(express.json());
app.use('/users', userRouter);

jest.mock('@prisma/client', () => {
    return {
      PrismaClient: jest.fn().mockImplementation(() => {
        return {
          user: {
            findMany: jest.fn().mockResolvedValue([
              { id: 1, name: 'John Doe', email: 'john@example.com' },
              { id: 2, name: 'Jane Doe', email: 'jane@example.com' },
            ]),
            findUnique: jest.fn().mockResolvedValue({ id: 1, email: 'test@example.com', role: 'USER' }),
            create: jest.fn().mockResolvedValue({ id: 3, email: 'test@example.com', role: 'USER' }),
          },
        };
      }),
    };
  });  

describe('User Routes', () => {
  it('should fetch all users', async () => {
    const response = await request(app).get('/users');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Doe', email: 'jane@example.com' },
    ]);
  });
});
