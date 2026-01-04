import { sequelize } from './connection';

import { initUserModel } from './usermodel';
import { initSurveyModel } from './surveymodel';
import { initQuestionModel } from './questionmodel';
import { initResponseModel } from './responsemodel';
import { initOptionModel } from './optionmodel';

export const initModels = () => {
  initUserModel(sequelize);
  initSurveyModel(sequelize);
  initQuestionModel(sequelize);
  initOptionModel(sequelize);
  initResponseModel(sequelize);

  
};
