import {Sequelize } from 'sequelize';
import { initUserModel} from './model/user.model';
import { initSurveyModel } from './model/survey.model';
import { initQuestionModel } from './model/question.model';
import { initResponseModel } from './model/response.model';
import { initOptionModel } from './model/option.model';



const sequelize = new Sequelize('survey_db', 'user', 'password', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false, // Disable logging; default: console.log //ask if this is ok
});

//Initialize models
initUserModel(sequelize);
initSurveyModel(sequelize);
initQuestionModel(sequelize);
initResponseModel(sequelize);
initOptionModel(sequelize);

import {associateModels} from './model/associations';
associateModels();

export {sequelize};



