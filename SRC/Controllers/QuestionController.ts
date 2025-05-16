import { Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { QuestionService } from '../Services/QuestionServices';

export class QuestionController {
  private questionService = Container.get(QuestionService);

  public getQuestionsBySurveyId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const surveyId = Number(req.params.surveyId);
      const questions = await this.questionService.findQuestionBySurveyId(surveyId);
      res.status(200).json({ data: questions, message: 'Questions fetched' });
    } catch (error) {
      next(error);
    }
  };

  public createQuestion = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const question = await this.questionService.createQuestion(req.body);
      res.status(201).json({ data: question, message: 'Question created' });
    } catch (error) {
      next(error);
    }
  };

  public updateQuestionById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const questionId = Number(req.params.id);
      const question = await this.questionService.updateQuestionById(questionId, req.body);
      res.status(200).json({ data: question, message: 'Question updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteQuestionById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const questionId = Number(req.params.id);
      await this.questionService.deleteQuestion(questionId);
      res.status(200).json({ message: 'Question deleted' });
    } catch (error) {
      next(error);
    }
  };
}
    