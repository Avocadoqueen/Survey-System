import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { Routes } from '../interface/routed.interface';
import { authenticateToken } from '../middlewares/authenticate-token.middleware';

class UserRoute implements Routes {
  public path = '/users';
  public router = Router();
  public userController = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('', authenticateToken, this.userController.getAllUsers);
    this.router.get('/:id', authenticateToken, this.userController.getUserById);
    this.router.post('', this.userController.createUser);
    this.router.put('/:id', authenticateToken, this.userController.updateUserById);
    this.router.delete('/:id', authenticateToken, this.userController.deleteUserById);
  }
}

export default UserRoute;
