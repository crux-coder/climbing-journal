import express from 'express';
import dotenv from 'dotenv';
import { errorHandler } from 'src/middleware/error.handler';
// Routers
import authRouter from 'src/auth';
import usersRouter from 'src/users';
import climbingrouteRouter from 'src/climbingroute';

const app = express();
dotenv.config();
app.use(express.json());

app.use('/auth', authRouter);

app.use('/climbingroutes', climbingrouteRouter);
app.use('/users', usersRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});