require('dotenv').config();
const express = require("express");
const cookieParser = require('cookie-parser')
const cors = require('cors');

import { unprotectedRouter } from './routes/unprotected';
import { protectedRouter } from './routes/protected';
import { authenticate } from './middleware/auth';

const port = process.env.PORT || 3000;
const app = express();
console.log(process.env.ALLOWED_ORIGINS);
// Parse allowed origins from .env
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : ['http://localhost:5173'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}))
app.use(cookieParser())
app.use(express.json())

app.use('/api/unauth', unprotectedRouter);
app.use('/api/auth', authenticate, protectedRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});