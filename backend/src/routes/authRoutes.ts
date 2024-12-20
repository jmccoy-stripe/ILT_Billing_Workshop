import express from 'express';
import { generateToken } from '../controllers/authController';

const router = express.Router();

router.post('/generate-token', generateToken);

export default router;
