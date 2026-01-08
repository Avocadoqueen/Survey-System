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

  public async addQuestionsToSurvey(surveyId: number, questions: any[]): Promise<any[]> {
    const survey = await SurveyModel.findByPk(surveyId);
    if (!survey) throw new HTTPException(404, 'Survey not found');

    const questionsArray = Array.isArray(questions) ? questions : [questions];
    const newQuestions = questionsArray.map((q, i) => ({
      id: Date.now() + i,
      ...q,
      survey_id: surveyId
    }));

    const existingQuestions = (survey as any).questions || [];
    const updatedQuestions = [...existingQuestions, ...newQuestions];
    
    await survey.update({ questions: updatedQuestions });
    return newQuestions;
  }

  public async submitSurveyResponse(responseData: any): Promise<any> {
    const survey = await SurveyModel.findByPk(responseData.survey_id);
    if (!survey) throw new HTTPException(404, 'Survey not found');

    const newResponse = {
      id: Date.now(),
      ...responseData,
      submitted_at: new Date()
    };

    const existingResponses = (survey as any).responses || [];
    await survey.update({ responses: [...existingResponses, newResponse] });
    
    return newResponse;
  }

  public async findSurveyResponses(surveyId: number): Promise<any[]> {
    const survey = await SurveyModel.findByPk(surveyId);
    if (!survey) throw new HTTPException(404, 'Survey not found');
    
    return (survey as any).responses || [];
  }
}