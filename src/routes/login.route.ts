import express from 'express';
import { LoginController } from '../controllers';
const router = express.Router();

router.post('/api/v1/login', LoginController.login);

export default router;
