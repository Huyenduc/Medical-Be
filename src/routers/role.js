import { Router } from 'express';
import checkToken from './verifyToken';

const roleController = require('../controllers/role.controller');
const router = Router();

router.post('/create', checkToken, roleController.createRole);
router.delete('/delete:id', checkToken, roleController.deleteRoleById);
router.patch('/update:id', checkToken, roleController.updateRole);
router.get('/get-all', checkToken, roleController.getAllRoles)
router.get('/get-one:id', checkToken, roleController.getOneRole)
export default router;