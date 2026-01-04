import { DataTypes, Model, Optional, Sequelize  } from "sequelize";

interface QuestionAttributes {
    question_id: number;
    survey_id: number;
    question_text: string;
    question_type: string;
    created_at: Date;

}

interface  QuestionCreationAttributes extends Optional<QuestionAttributes, 'question_id' | 'created_at'> {}

export class QuestionModel extends Model<QuestionCreationAttributes, QuestionCreationAttributes> implements QuestionAttributes {
    public question_id!: number;
    public survey_id!: number;
    public question_text!: string;
    public question_type!: string;
    public created_at!: Date;
}

export const initQuestionModel = (sequelize: Sequelize) => {
  QuestionModel.init({
    question_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    survey_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    question_text: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    question_type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    created_at: {       
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
  }, {
    sequelize,
    tableName: 'Questions',
    timestamps: false,
    });
};

        
    