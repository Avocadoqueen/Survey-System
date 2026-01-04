import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export interface OptionAttributes {
  id: number;
  questionId: number;
  optionText: string;
  createdAt: Date;
}

export interface OptionCreationAttributes extends Optional<OptionAttributes, 'id' | 'createdAt'> {}

export class OptionModel extends Model<OptionAttributes, OptionCreationAttributes> implements OptionAttributes {
  public id!: number;
  public questionId!: number;
  public optionText!: string;
  public createdAt!: Date;
}

export const initOptionModel = (sequelize: Sequelize) => {
  OptionModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      questionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      optionText: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    },
    {
      sequelize,
      tableName: 'Options',
      timestamps: false,
    }
  );
};

export type OptionInstance = typeof OptionModel & {
  new (): OptionModel;
};
