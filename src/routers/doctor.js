import { Router } from 'express';

const doctorController = require('../controllers/doctor.controller');
const router = Router();

router.post('/create', doctorController.createDoctor);
router.delete('/delete:id', doctorController.deleteDoctor);
router.patch('/update:id', doctorController.updateDoctor);
router.get('/get-all', doctorController.getAllDoctors)
export default router;