import { Service } from 'typedi';
import { Op } from 'sequelize';
import { SurveyModel } from '../model/SurveyModel';
import { HTTPException } from '../exceptions/HTTPException';

@Service()
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
    await SurveyModel.update(data, { where: { user_id: surveyId } });
    const updated = await SurveyModel.findByPk(surveyId);
    if (!updated) throw new HTTPException(500, 'Update failed');
    return updated;
  }

  public async deleteSurvey(surveyId: number): Promise<void> {
    const survey = await SurveyModel.findByPk(surveyId);
    if (!survey) throw new HTTPException(404, 'Survey not found');
    await survey.destroy();
  }
  
  public async findSurveyByResponsesId(surveyId: number): Promise<any> {
    // Implement the logic to fetch survey responses by surveyId
    // Example:
    return [
      { responseId: 1, surveyId, answer: 'Answer 1' },
      { responseId: 2, surveyId, answer: 'Answer 2' },
      ];

  }
}
