import { Router } from 'express';
import { QuestionController } from '../controllers/QuestionController';
import { Routes } from '../src/interfaces/RoutedInterface';
import { authenticateToken } from '../src/middlewares/authenticateToken';

class QuestionRoute implements Routes {
  public path = '/questions';
  public router = Router();
  public questionController = new QuestionController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/survey/:surveyId', authenticateToken, this.questionController.getQuestionsBySurveyId);
    this.router.post('', authenticateToken, this.questionController.createQuestion);
    this.router.put('/:id', authenticateToken, this.questionController.updateQuestionById);
    this.router.delete('/:id', authenticateToken, this.questionController.deleteQuestionById);
  }
}

export default QuestionRoute;
