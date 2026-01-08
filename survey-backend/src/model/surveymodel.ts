import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

interface SurveyAttributes {
    survey_id: number;
    title: string;
    description: string;
    created_at: Date;
    user_id: number;
    questions: any[];
    responses: any[];
}
  
interface SurveyCreationAttributes extends Optional<SurveyAttributes, 'survey_id' | 'created_at' | 'questions' | 'responses'> {}
  
export class SurveyModel extends Model<SurveyAttributes, SurveyCreationAttributes> implements SurveyAttributes {
    public survey_id!: number;
    public title!: string;
    public description!: string;
    public created_at!: Date;
    public user_id!: number;
    public questions!: any[];
    public responses!: any[];
}

export const initSurveyModel = (sequelize: Sequelize) => {
    SurveyModel.init({
        survey_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        }, 

        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },

        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },

        created_at: {
          type: DataTypes.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },

        user_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },

        questions: {
          type: DataTypes.JSON,
          allowNull: true,
          defaultValue: [],
        },

        responses: {
          type: DataTypes.JSON,
          allowNull: true,
          defaultValue: [],
        },
    }, {
      sequelize,
      tableName: 'Surveys',
      timestamps: false,
    });
};