import { Service } from 'typedi';
import { UserModel } from '../model/UserModel';
import { HTTPException } from '../exceptions/HTTPException';

@Service()
export class UserService {
  public async findAllUsers(): Promise<UserModel[]> {
    return await UserModel.findAll();
  }

  public async findUserById(userId: number): Promise<UserModel> {
    const user = await UserModel.findByPk(userId);
    if (!user) throw new HTTPException(404, 'User not found');
    return user;
  }

  public async createUser(userData: any): Promise<UserModel> {
    try {
      const newUser = await UserModel.create(userData);
      return newUser;
    } catch (error) {
      throw new HTTPException(400, 'Error creating user');
    }
  }

  public async updateUserById(userId: number, userData: Partial<UserModel>): Promise<UserModel> {
    const user = await UserModel.findByPk(userId);
    if (!user) throw new HTTPException(404, 'User not found');

    await UserModel.update(userData, { where: { user_id: userId } });
    const updatedUser = await UserModel.findByPk(userId);
    if (!updatedUser) throw new HTTPException(500, 'Error updating user');
    return updatedUser;
  }

  public async deleteUserById(userId: number): Promise<UserModel> {
    const user = await UserModel.findByPk(userId);
    if (!user) throw new HTTPException(404, 'User not found');
    
    await UserModel.destroy({ where: { user_id: userId } });
    return user;
  }
}
