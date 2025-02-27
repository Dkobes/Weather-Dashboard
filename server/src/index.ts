import { Router } from 'express';
const router = Router();

import apiRoutes from '../src/index.js';
import htmlRoutes from './routes/htmlRoutes.js';

router.use('/api', apiRoutes);
router.use('/', htmlRoutes);

export default router;
