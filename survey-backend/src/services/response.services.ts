import { ResponseModel } from '../model/responsemodel';
import { HTTPException } from '../exceptions/http.exception';

export class ResponseService {
  public async findResponseByUserId(userId: number): Promise<ResponseModel[]> {
    return await ResponseModel.findAll({ where: { user_id: userId } });
  }

  public async findResponseBySurveyId(surveyId: number): Promise<ResponseModel[]> {
    return await ResponseModel.findAll({ where: { survey_id: surveyId } });
  }

  public async findResponseByQuestionId(questionId: number): Promise<ResponseModel[]> {
    return await ResponseModel.findAll({ where: { question_id: questionId } });
  }

  public async createResponse(data: any): Promise<ResponseModel> {
    return await ResponseModel.create(data);
  }

  public async deleteResponse(responseId: number): Promise<void> {
    const response = await ResponseModel.findByPk(responseId);
    if (!response) throw new HTTPException(404, 'Response not found');
    await response.destroy();
  }
}
