import { Router } from 'express';

const bloodGroupController = require('../controllers/bloodGroup.controller');
const router = Router();

router.post('/create', bloodGroupController.createBloodGroup);
router.delete('/delete:id', bloodGroupController.deleteBloodGroup);
router.patch('/update:id', bloodGroupController.updateBloodGroup);
router.get('/get-all', bloodGroupController.getAllBloodGroups);
router.get('/get-one:id', bloodGroupController.getOneBloodGroup);
export default router;  