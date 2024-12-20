import express from 'express';
import { getCustomer, createCustomer } from '../controllers/customerController';

const router = express.Router();

router.get('/:email', getCustomer);
router.post('/', createCustomer);

export default router;
