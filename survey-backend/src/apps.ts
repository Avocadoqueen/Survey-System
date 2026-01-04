import express from 'express';
import { initModels } from './model';
import bodyParser from 'body-parser';
import cors from 'cors';

import SurveyRoute from './routes/survey.route';
import QuestionRoute from './routes/question.route';
import ResponseRoute from './routes/response.route';
import OptionRoute from './routes/option.route';
import UserRoute from './routes/user.route';
import authRoutes from './routes/auth.route'; 

const app = express();

// CORS configuration - allows frontend to connect
app.use(cors({
  origin: '*', // Allow all origins (change to your frontend URL in production)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// ✅ ROUTES (also FIXED missing /)
app.use('/api/surveys', new SurveyRoute().router);
app.use('/api/questions', new QuestionRoute().router);
app.use('/api/responses', new ResponseRoute().router);
app.use('/api/options', new OptionRoute().router);
app.use('/api/users', new UserRoute().router);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Survey API is running!');
});

export default app;
