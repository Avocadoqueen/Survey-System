import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors'
import SurveyRoute from '../SRC/routes/SurveyRoute';
import QuestionRoute from '../SRC/routes/QuestionRoute';
import ResponseRoute from '../SRC/routes/ResponseRoute';
import OptionRoute from '../SRC/routes/OptionRoute';
//import {authenticateToken} from '../SRC/middlewares/authenticateToken';


const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Mounting the routes
app.use('api/surveys', new SurveyRoute().router);
app.use('api/questions', new QuestionRoute().router);
app.use('api/responses', new ResponseRoute().router);
app.use('api/options', new OptionRoute().router);

//default route
app.get('/', (req, res) =>  res.send('Survey API is running!'));

export default app;
