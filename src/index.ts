import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes/index.routes';
import errorHandler from './middlewares/errorHandler.middleware';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(router);
app.use(errorHandler);

const PORT = process.env.PORT || 5000; /* eslint-disable-line */

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
