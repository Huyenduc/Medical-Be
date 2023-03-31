import { Router } from 'express';

const roleController = require('../controllers/role.controller');
const router = Router();

router.post('/create', roleController.createRole);
router.delete('/delete:id', roleController.deleteRoleById);
router.patch('/update:id', roleController.updateRole);
router.get('/get-all', roleController.getAllRoles)
export default router;