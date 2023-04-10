import { Router } from 'express';

const workplaceController = require('../controllers/workplace.controller');
const router = Router();

router.post('/create', workplaceController.createWorkplace);
router.delete('/delete:id', workplaceController.deleteWorkplace);
router.patch('/update:id', workplaceController.updateWorkplace);
router.get('/get-all', workplaceController.getAllWorkplace);
router.get('/get-one:id', workplaceController.getOneWorkplace);
export default router;