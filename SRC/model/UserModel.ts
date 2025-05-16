import { DataTypes, Model, Optional, Sequelize} from 'sequelize';

interface UserAttributes {
    user_id: number;
    username: string;
    email: string;
    created_at: Date;
    updated_at: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'user_id'| 'created_at'| 'updated_at'> {}
export class UserModel extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public user_id!: number;
    public username!: string;
    public email!: string;
    public created_at!: Date;
    public updated_at!: Date;
  }
  
  export const initUserModel = (sequelize: Sequelize) => {
    UserModel.init({
      user_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    }, {
      sequelize,
      tableName: 'Users',
      timestamps: false,
    });
  };