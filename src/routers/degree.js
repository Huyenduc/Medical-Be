import { Router } from 'express';

const degreeController = require('../controllers/degree.controller');
const router = Router();

router.post('/create', degreeController.createDegree);
router.delete('/delete:id', degreeController.deleteDegree);
router.patch('/update:id', degreeController.updateDegree);
router.get('/get-all', degreeController.getAllDegrees)
export default router;