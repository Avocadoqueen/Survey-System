import { Service } from 'typedi';
import { HTTPException } from '../exceptions/HTTPException';
import { ResponseModel } from '../model/ResponseModel';

@Service()
export class ResponseService {
  public async findAllAnswers(): Promise<ResponseModel[]> {
    return await ResponseModel.findAll();
  }

  public async findResponseByUserId(userId: number): Promise<ResponseModel[]> {
    return await ResponseModel.findAll({ where: { user_id: userId } }); // Explicitly specifying userId
  }
  public async findResponseBySurveyId(surveyId: number): Promise<ResponseModel[]> {
    return await ResponseModel.findAll({ where: { survey_id: surveyId } }); // Explicitly specifying surveyId
  }

  public async createResponse(data: any): Promise<ResponseModel> {
    return await ResponseModel.create(data);
  }
  

  
}
