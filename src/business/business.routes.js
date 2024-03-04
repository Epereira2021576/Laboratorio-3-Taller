import { Router } from 'express';
import { check } from 'express-validator';
import {
  businessPost,
  businessPut,
  businessGet,
  businessExcel,
} from './business.controller.js';
import {
  businessExists,
  businessExistsById,
} from '../helpers/db-validators.js';
import { validateFields } from '../middlewares/validate-fields.js';
import { validateJWT } from '../middlewares/validate-jwt.js';

const router = new Router();

router.get('/', [validateJWT, validateFields], businessGet);

router.post(
  '/',
  [
    check('name').custom(businessExists),
    check('impactLevel', 'The impact level is required').not().isEmpty(),
    check('operationTime', 'The operation time is required').not().isEmpty(),
    check('category', 'The category is required').not().isEmpty(),
    check('size', 'The size is required').not().isEmpty(),
    validateFields,
  ],
  businessPost
);

router.get('/:orderReference', [validateJWT, validateFields], businessGet);

router.get('/generateReport', [validateJWT, validateFields], businessExcel);

router.put(
  '/:id',
  [
    check('id', 'The id is not a valid MongoDB format').isMongoId(),
    check('id').custom(businessExistsById),
    validateFields,
  ],
  businessPut
);

export default router;
