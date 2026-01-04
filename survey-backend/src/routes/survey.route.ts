import { Router } from 'express';
import { SurveyController } from '../controllers/survey.controller';
import { Routes } from '../interface/routed.interface';
import { authenticateToken } from '../middlewares/authenticate-token.middleware';

class SurveyRoute implements Routes {
  public path = '/surveys';
  public router = Router();
  public surveyController = new SurveyController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('', authenticateToken, this.surveyController.getAllSurveys);
    this.router.get('/:id', authenticateToken, this.surveyController.getSurveyById);
    this.router.post('', authenticateToken, this.surveyController.createSurvey);
    this.router.put('/:id', authenticateToken, this.surveyController.updateSurveyById);
    this.router.delete('/:id', authenticateToken, this.surveyController.deleteSurveyById);
  }
}

export default SurveyRoute;
