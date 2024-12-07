import * as express from 'express';
import { create, getAll, getById, update } from './users.controller';
import { validateParamsId } from 'src/middleware/validate.params.id';

const router = express.Router();

router.post('/', create);
router.get('/', getAll);
router.get('/:id', validateParamsId, getById);
router.put('/:id', validateParamsId, update);

export default router;