import { Router } from 'express';

const patientController = require('../controllers/patient.controller');
const router = Router();

router.post('/create', patientController.createPatient);
router.delete('/delete:id', patientController.deletePatient);
router.patch('/update:id', patientController.updatePatient);
router.get('/get-all', patientController.getAllPatients)
export default router;  
        