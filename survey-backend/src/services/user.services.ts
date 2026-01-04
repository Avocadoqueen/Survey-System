import { UserModel } from '../model/usermodel';
import { HTTPException } from '../exceptions/http.exception';

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
    return await UserModel.create(userData);
  }

  public async updateUserById(userId: number, userData: Partial<UserModel>): Promise<UserModel> {
    const user = await UserModel.findByPk(userId);
    if (!user) throw new HTTPException(404, 'User not found');
    return await user.update(userData);
  }

  public async deleteUserById(userId: number): Promise<UserModel> {
    const user = await UserModel.findByPk(userId);
    if (!user) throw new HTTPException(404, 'User not found');
    await user.destroy();
    return user;
  }
}
