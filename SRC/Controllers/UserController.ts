import { Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { UserService } from '../Services/UserServices';

export class UserController {
  public userService = Container.get(UserService);

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
      const userData = req.body;
      const newUser = await this.userService.createUser(userData);
      res.status(201).json({ data: newUser, message: 'User created successfully' });
    } catch (error) {
      next(error);
    }
  };

  public updateUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = Number(req.params.id);
      const userData = req.body;
      const updatedUser = await this.userService.updateUserById(userId, userData);
      res.status(200).json({ data: updatedUser, message: 'User updated successfully' });
    } catch (error) {
      next(error);
    }
  };

  public deleteUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = Number(req.params.id);
      const deletedUser = await this.userService.deleteUserById(userId);
      res.status(200).json({ data: deletedUser, message: 'User deleted successfully' });
    } catch (error) {
      next(error);
    }
  };
}
