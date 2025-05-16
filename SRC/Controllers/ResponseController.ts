import {Request, Response, NextFunction} from 'express';
import {Container} from 'typedi';
import {ResponseService} from '../Services/ResponseServices';

export class ResponseController{
  private responseService = Container.get(ResponseService);

 
  public getResponseByUserId = async(req: Request, res: Response, next: NextFunction) => {
    try{
      const userId = Number(req.params.userId);
      const response = await this.responseService.findResponseByUserId(userId);
      res.status(200).json({data: response, message: 'Response fetched'});
    }catch(error){
      next(error);
    }  
  }

  public getResponseBySurveyId = async(req: Request, res: Response, next: NextFunction) => {
    try{
      const surveyId = Number(req.params.surveyId);
      const response = await this.responseService.findResponseBySurveyId(surveyId); 
      res.status(200).json({data: response, message: 'Response fetched'});
    }catch(error){
      next(error);
    }
  }

  public getResponseByQuestionId = async(req: Request, res: Response, next: NextFunction) => {
    try{
      const questionId = Number(req.params.questionId);
      const response = await this.responseService.findResponseByUserId(questionId);
      res.status(200).json({data: response, message: 'Response fetched'});
    }catch(error){
      next(error);
    }
  }

  public createResponse = async(req: Request, res: Response, next: NextFunction) => {
    try{
      const response = await this.responseService.createResponse(req.body);
      res.status(201).json({data: response, message: 'Response created'});
    }catch(error){
      next(error);
    }
  }

  public updateResponseById = async(req: Request, res: Response, next: NextFunction) => {
    try{
      const responseId = Number(req.params.id);
      const response = await this.responseService.findResponseByUserId(responseId);
      res.status(200).json({data: response, message: 'Response updated'});
    }catch(error){
      next(error);
    }
  }

  public deleteResponseById = async(req: Request, res: Response, next: NextFunction) => {
    try{
      const responseId = Number(req.params.id);
      const response = await this.responseService.findResponseByUserId(responseId);
      res.status(200).json({data: response, message: 'Response deleted'});
    }catch(error){
      next(error);
    }
  }
};
// public createResponse = async(req: Request, res: Response, next: NextFunction) => {