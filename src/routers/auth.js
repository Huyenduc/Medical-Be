import { Router } from 'express';

const authController = require('../controllers/auth.controller');
const router = Router();

router.post('/login', authController.login);
router.get('/images/:imageName', authController.getAvatar)
export default router;