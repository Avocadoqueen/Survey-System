import { Request, Response, NextFunction } from 'express';
import { SurveyService } from '../services/survey.services';

export class SurveyController {
  private surveyService = new SurveyService();

  public getAllSurveys = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const surveys = await this.surveyService.findAllSurveys();
      res.status(200).json({ data: surveys, message: 'Surveys retrieved successfully' });
    } catch (error) {
      console.error('getAllSurveys error:', error);
      next(error);
    }
  };

  public getSurveyById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const surveyId = Number(req.params.id || req.params.surveyId);
      const survey = await this.surveyService.findSurveyById(surveyId);
      res.status(200).json({ data: survey, message: 'Survey retrieved successfully' });
    } catch (error) {
      console.error('getSurveyById error:', error);
      next(error);
    }
  };

  public createSurvey = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log('=== CREATE SURVEY DEBUG ===');
      console.log('req.user:', req.user);
      console.log('req.body:', req.body);
      
      const user_id = req.user?.id || req.user?.user_id;
      console.log('user_id:', user_id);
      
      if (!user_id) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const surveyData = {
        title: req.body.title,
        description: req.body.description || '',
        user_id: user_id
      };
      
      console.log('surveyData:', surveyData);

      const newSurvey = await this.surveyService.createSurvey(surveyData);
      res.status(201).json({ data: newSurvey, message: 'Survey created successfully' });
    } catch (error: any) {
      console.error('createSurvey error:', error);
      res.status(500).json({ message: 'Error creating survey', error: error.message });
    }
  };

  public addQuestions = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const surveyId = Number(req.params.id || req.params.surveyId);
      const questions = req.body.questions || req.body;
      const result = await this.surveyService.addQuestionsToSurvey(surveyId, questions);
      res.status(201).json({ data: result, message: 'Questions added successfully' });
    } catch (error: any) {
      console.error('addQuestions error:', error);
      res.status(500).json({ message: 'Error adding questions', error: error.message });
    }
  };

  public submitResponse = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const surveyId = Number(req.params.id || req.params.surveyId);
      const userId = req.user?.id || req.user?.user_id;
      const responseData = {
        ...req.body,
        survey_id: surveyId,
        user_id: userId
      };
      const result = await this.surveyService.submitSurveyResponse(responseData);
      res.status(201).json({ data: result, message: 'Response submitted successfully' });
    } catch (error: any) {
      console.error('submitResponse error:', error);
      res.status(500).json({ message: 'Error submitting response', error: error.message });
    }
  };

  public getSurveyResponses = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const surveyId = Number(req.params.id || req.params.surveyId);
      const responses = await this.surveyService.findSurveyResponses(surveyId);
      res.status(200).json({ data: responses, message: 'Survey responses retrieved successfully' });
    } catch (error: any) {
      console.error('getSurveyResponses error:', error);
      res.status(500).json({ message: 'Error getting responses', error: error.message });
    }
  };

  public deleteSurveyById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const surveyId = Number(req.params.id || req.params.surveyId);
      await this.surveyService.deleteSurvey(surveyId);
      res.status(200).json({ message: 'Survey deleted successfully' });
    } catch (error) {
      console.error('deleteSurveyById error:', error);
      next(error);
    }
  };

  public updateSurveyById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const surveyId = Number(req.params.id || req.params.surveyId);
      const updatedSurvey = await this.surveyService.updateSurvey(surveyId, req.body);
      res.status(200).json({ data: updatedSurvey, message: 'Survey updated successfully' });
    } catch (error) {
      console.error('updateSurveyById error:', error);
      next(error);
    }
  };
}