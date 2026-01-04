import { Request, Response, NextFunction } from 'express';
import { SurveyService } from '../services/survey.services';

export class SurveyController {
  private surveyService = new SurveyService();

  public getAllSurveys = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const surveys = await this.surveyService.findAllSurveys();
      res.status(200).json({ data: surveys, message: 'Surveys retrieved successfully' });
    } catch (error) {
      next(error);
    }
  };

  public getSurveyById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const surveyId = Number(req.params.id);
      const survey = await this.surveyService.findSurveyById(surveyId);
      res.status(200).json({ data: survey, message: 'Survey retrieved successfully' });
    } catch (error) {
      next(error);
    }
  };

  public createSurvey = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const newSurvey = await this.surveyService.createSurvey(req.body);
      res.status(201).json({ data: newSurvey, message: 'Survey created successfully' });
    } catch (error) {
      next(error);
    }
  };

  public getSurveyResponses = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const surveyId = Number(req.params.id);
      const responses = await this.surveyService.findSurveyByResponsesId(surveyId);
      res.status(200).json({ data: responses, message: 'Survey responses retrieved successfully' });
    } catch (error) {
      next(error);
    }
  };

  public deleteSurveyById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const surveyId = Number(req.params.id);
      await this.surveyService.deleteSurvey(surveyId);
      res.status(200).json({ message: 'Survey deleted successfully' });
    } catch (error) {
      next(error);
    }
  };

  public updateSurveyById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const surveyId = Number(req.params.id);
      const updatedSurvey = await this.surveyService.updateSurvey(surveyId, req.body);
      res.status(200).json({ data: updatedSurvey, message: 'Survey updated successfully' });
    } catch (error) {
      next(error);
    }
  };
}
