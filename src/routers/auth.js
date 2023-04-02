import { Router } from 'express';

const authController = require('../controllers/auth.controller');
const router = Router();

router.post('/login', authController.login);
// router.delete('/delete:id', roleController.deleteRoleById);
// router.patch('/update:id', roleController.updateRole);
// router.get('/get-all', roleController.getAllRoles)
export default router;