import express from 'express';
// Routes import

import emails from './emails';
import users from './users'

const router = express.Router();
router
  .use('/emails', emails)
  .use('/users', users);

export default router;
