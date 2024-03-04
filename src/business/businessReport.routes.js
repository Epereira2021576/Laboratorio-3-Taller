import { Router } from 'express';
import { validateFields } from '../middlewares/validate-fields.js';
import { validateJWT } from '../middlewares/validate-jwt.js';
import { businessExcel } from './business.controller.js';
const router = Router();

router.get('/generateReport', [validateJWT, validateFields], businessExcel);

export default router;
