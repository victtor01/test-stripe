import 'dotenv/config';
import 'reflect-metadata';

import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { errorMiddleware } from './api/middleware/error.middleware';
import { bootstrap } from './boostrap';
import { routers } from './container';

const PORT = process.env.PORT || 8080;
const webhookPath = '/api/webhooks/stripe';

const row = express.raw({ type: 'application/json' });

const app = express();

app.use(webhookPath, row);
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: '*', credentials: true }));
app.use('/api', routers);

app.use(errorMiddleware);

bootstrap();

app.listen(PORT, () => {
  console.log('server running');
});
