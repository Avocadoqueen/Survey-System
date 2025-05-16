import { Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { SurveyService } from '../Services/SurveyServiceS';

export class SurveyController {
  public surveyService = Container.get(SurveyService);

  // Get all surveys
  public getAllSurveys = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const surveys = await this.surveyService.findAllSurveys();
      res.status(200).json({ data: surveys, message: 'Surveys retrieved successfully' });
    } catch (error) {
      next(error);
    }
  };

  // Get a survey by ID
  public getSurveyById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const surveyId = Number(req.params.id);
      const survey = await this.surveyService.findSurveyById(surveyId);
      res.status(200).json({ data: survey, message: 'Survey retrieved successfully' });
    } catch (error) {
      next(error);
    }
  };

  // Create a new survey
  public createSurvey = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const surveyData = req.body;
      const newSurvey = await this.surveyService.createSurvey(surveyData);
      res.status(201).json({ data: newSurvey, message: 'Survey created successfully' });
    } catch (error) {
      next(error);
    }
  };

//   // Get questions of a survey
//   public getSurveyQuestions = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const surveyId = Number(req.params.id);
//       const questions = await this.surveyService.findSurveyByQuestionsId(surveyId);
//       res.status(200).json({ data: questions, message: 'Survey questions retrieved successfully' });
//     } catch (error) {
//       next(error);
//     }
//   };

  // Get all responses to a survey
  public getSurveyResponses = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const surveyId = Number(req.params.id);
      const responses = await this.surveyService.findSurveyByResponsesId(surveyId);
      res.status(200).json({ data: responses, message: 'Survey responses retrieved successfully' });
    } catch (error) {
      next(error);
    }
  };

  // Delete survey by ID
  public deleteSurveyById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const surveyId = Number(req.params.id);
      await this.surveyService.deleteSurvey(surveyId);
      res.status(200).json({ message: 'Survey deleted successfully' });
    } catch (error) {
      next(error);
    }
  };

  // Update survey by ID
  public updateSurveyById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const surveyId = Number(req.params.id);
      const surveyData = req.body;
      const updatedSurvey = await this.surveyService.updateSurvey(surveyId, surveyData);
      res.status(200).json({ data: updatedSurvey, message: 'Survey updated successfully' });
    } catch (error) {
      next(error);
    }
  };  
}
