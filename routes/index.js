import express from 'express';
import { registerController, loginController, userController, refreshController, productController } from '../controller' //brackets are used because "exported as"
import auth from '../middlewares/auth';
import admin from '../middlewares/admin';
// import refreshController from '../controller/auth/refreshController';


const router = express.Router();


router.post('/register', registerController.register);
router.post('/login', loginController.login);
router.get('/me', auth, userController.me);
router.post('/refresh', refreshController.refresh)
router.post('/logout', auth, loginController.logout)

router.post('/products', [auth, admin], productController.store)
router.put('/products/:id', [auth, admin], productController.update)
router.delete('/products/:id', [auth, admin], productController.destroy)
router.get('/products', productController.index)
router.get('/products/:id', productController.show) //get single products

export default router
