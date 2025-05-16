import {Sequelize } from 'sequelize';
import { initUserModel} from './model/UserModel';
import { initSurveyModel } from './model/SurveyModel';
import { initQuestionModel } from './model/QuestionModel';
import { initResponseModel } from './model/ResponseModel';
import { initOptionModel } from './model/OptionModel';



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



