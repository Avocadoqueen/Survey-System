import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.services';

export class UserController {
  private userService = new UserService();

  public getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this.userService.findAllUsers();
      res.status(200).json({ data: users, message: 'Users retrieved successfully' });
    } catch (error) {
      next(error);
    }
  };

  public getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = Number(req.params.id);
      const user = await this.userService.findUserById(userId);
      res.status(200).json({ data: user, message: 'User retrieved successfully' });
    } catch (error) {
      next(error);
    }
  };

  public createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newUser = await this.userService.createUser(req.body);
      res.status(201).json({ data: newUser, message: 'User created successfully' });
    } catch (error) {
      next(error);
    }
  };

  public updateUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = Number(req.params.id);
      const updatedUser = await this.userService.updateUserById(userId, req.body);
      res.status(200).json({ data: updatedUser, message: 'User updated successfully' });
    } catch (error) {
      next(error);
    }
  };

  public deleteUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = Number(req.params.id);
      await this.userService.deleteUserById(userId);
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      next(error);
    }
  };
}
