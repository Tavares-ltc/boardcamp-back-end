import express from 'express';
import cors from 'cors';
import categoriesRoutes from './routes/categories.routes.js';
import gamesRoutes from './routes/games.routes.js';
import customersRoutes from './routes/customers.routes.js';

const server = express();
server.use(cors())
server.use(express.json());

server.use(categoriesRoutes);
server.use(gamesRoutes);
server.use(customersRoutes)

server.listen(4000, () => {
    console.log('Server is listening on port 4000.');
  });