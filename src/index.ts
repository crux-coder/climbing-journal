import express from 'express';
import usersRouter from 'src/users';
import dotenv from 'dotenv';
import { errorHandler } from 'src/middleware/error.handler';

const app = express();
dotenv.config();
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.use('/users', usersRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});