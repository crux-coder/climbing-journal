import * as express from 'express';
import { create, getAll, getById, update } from './climbingroute.controller';
import { validateParamsId } from 'src/middleware/validate.params.id';
import { authMiddleware } from 'src/middleware/auth.middleware';

const router = express.Router();

router.post('/', authMiddleware, create);
router.get('/', getAll);
router.get('/:id', validateParamsId, getById);
router.put('/:id', authMiddleware, validateParamsId, update);

export default router;