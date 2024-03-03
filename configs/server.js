'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './mongo.js';
import userRoutes from '../src/users/user.routes.js';
import businessRoutes from '../src/business/business.routes.js';

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.userPath = '/businessAPI/v1/users';
    this.businessPath = '/businessAPI/v1/business';

    this.middlewares();
    this.connectDB();
    this.routes();
  }

  async connectDB() {
    await dbConnection();
  }

  middlewares() {
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(helmet());
    this.app.use(morgan('dev'));
  }

  routes() {
    this.app.use(this.userPath, userRoutes);
    this.app.use(this.businessPath, businessRoutes);
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log('Server running on port ', this.port);
    });
  }
}

export default Server;
