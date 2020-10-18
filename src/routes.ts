import { Router } from 'express'
import OrphanagesController from './controllers/OrphanagesController'
import multer from 'multer';
import uploadConfig from './config/upload'
import UsersController from './controllers/UsersController';
import auth from './middleware/auth';

const routes = Router();
const upload = multer(uploadConfig);

routes.post('/orphanages',upload.array('images'), OrphanagesController.create);
routes.get('/orphanages', OrphanagesController.index);
routes.get('/orphanages/:id', OrphanagesController.show);
routes.post('/login', UsersController.login);
routes.post('/users', UsersController.create);

routes.use(auth)
routes.get('/me', UsersController.myAccount)
routes.get('/manageOrphanages', OrphanagesController.index)
routes.delete('/orphanages/:id', OrphanagesController.delete);


export default routes;
