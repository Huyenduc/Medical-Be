import {Router} from'express';

const user = require('../controllers/user.controller');
const router = Router();

router.get('/gettoken',user.getUser)

export default router;