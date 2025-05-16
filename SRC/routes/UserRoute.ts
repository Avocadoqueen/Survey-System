import { Router } from 'express';
import { UserController } from '../Controllers/UserController';
import { Routes } from '../src/interfaces/RoutedInterface';
import { authenticateToken } from '../src/middlewares/authenticateToken';

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
