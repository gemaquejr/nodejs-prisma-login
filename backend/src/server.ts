import express, { Application } from 'express';
import bodyParser from 'body-parser';
import prisma from './config/db.js';

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

const startServer = async (): Promise<void> => {
  try {
    await prisma.$connect();
    console.log('Banco de dados conectado');
    app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
  }
};

startServer();
