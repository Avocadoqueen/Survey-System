import { UserModel } from './usermodel';
import { SurveyModel } from './surveymodel';
import { QuestionModel } from './questionmodel';
import { ResponseModel } from './responsemodel';
import { OptionModel } from './optionmodel';

export const associateModels = () => {
  UserModel.hasMany(SurveyModel, { foreignKey: 'user_id' });
  SurveyModel.belongsTo(UserModel, { foreignKey: 'user_id' });

  SurveyModel.hasMany(QuestionModel, { foreignKey: 'survey_id' });
  QuestionModel.belongsTo(SurveyModel, { foreignKey: 'survey_id' });

  QuestionModel.hasMany(OptionModel, { foreignKey: 'question_id' });
  OptionModel.belongsTo(QuestionModel, { foreignKey: 'question_id' });

  QuestionModel.hasMany(ResponseModel, { foreignKey: 'question_id' });
  ResponseModel.belongsTo(QuestionModel, { foreignKey: 'question_id' });

  UserModel.hasMany(ResponseModel, { foreignKey: 'user_id' });
  ResponseModel.belongsTo(UserModel, { foreignKey: 'user_id' });
};
