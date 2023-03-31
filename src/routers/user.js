import {Router} from'express';

const userController = require('../controllers/user.controller');
const router = Router();

router.get('/get-all', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/create', userController.createUser);
router.patch('/update:id', userController.updateUser);
router.delete('/delete:id', userController.deleteUser);

export default router;