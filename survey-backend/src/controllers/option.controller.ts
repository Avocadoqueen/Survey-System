import { Request, Response, NextFunction } from 'express';
import { OptionService } from '../services/option.services';

export class OptionController {
  private optionService = new OptionService();

  public getOptionsByQuestionId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const questionId = Number(req.params.questionId);
      const options = await this.optionService.findOptionsByQuestionId(questionId);
      res.status(200).json({ data: options, message: 'Options fetched' });
    } catch (error) {
      next(error);
    }
  };

  public createOption = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const option = await this.optionService.createOption(req.body);
      res.status(201).json({ data: option, message: 'Option created' });
    } catch (error) {
      next(error);
    }
  };
}
