const express = require("express");
const cookieParser = require('cookie-parser')

import { unprotectedRouter } from './routes/unprotected';
import { protectedRouter } from './routes/protected';
import { authenticate } from './middleware/auth';

const port = process.env.PORT || 3000;
const app = express();

app.use(cookieParser())
app.use(express.json())

app.use('/api/unauth', unprotectedRouter);
app.use('/api/auth', authenticate, protectedRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});