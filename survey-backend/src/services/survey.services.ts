import { SurveyModel } from '../model/surveymodel';
import { HTTPException } from '../exceptions/http.exception';

export class SurveyService {
  public async findAllSurveys(): Promise<SurveyModel[]> {
    return await SurveyModel.findAll();
  }

  public async findSurveyById(surveyId: number): Promise<SurveyModel> {
    const survey = await SurveyModel.findByPk(surveyId);
    if (!survey) throw new HTTPException(404, 'Survey not found');
    return survey;
  }

  public async createSurvey(data: any): Promise<SurveyModel> {
    return await SurveyModel.create(data);
  }

  public async updateSurvey(surveyId: number, data: any): Promise<SurveyModel> {
    const survey = await SurveyModel.findByPk(surveyId);
    if (!survey) throw new HTTPException(404, 'Survey not found');
    return await survey.update(data);
  }

  public async deleteSurvey(surveyId: number): Promise<void> {
    const survey = await SurveyModel.findByPk(surveyId);
    if (!survey) throw new HTTPException(404, 'Survey not found');
    await survey.destroy();
  }

  public async findSurveyByResponsesId(surveyId: number): Promise<any[]> {
    return [];
  }
}
