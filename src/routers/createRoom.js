import { Router } from 'express';

const getToken = require('../controllers/createRoom.controller');
const router = Router();


router.get('/getToken', getToken.createRoom);
// router.get('/notification', getToken.notification);

export default router; 