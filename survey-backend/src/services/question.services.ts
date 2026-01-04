import { QuestionModel } from '../model/questionmodel';
import { HTTPException } from '../exceptions/http.exception';

export class QuestionService {
  public async findQuestionBySurveyId(surveyId: number): Promise<QuestionModel[]> {
    return await QuestionModel.findAll({ where: { survey_id: surveyId } });
  }

  public async createQuestion(data: any): Promise<QuestionModel> {
    return await QuestionModel.create(data);
  }

  public async updateQuestionById(questionId: number, data: any): Promise<QuestionModel> {
    const question = await QuestionModel.findByPk(questionId);
    if (!question) throw new HTTPException(404, 'Question not found');
    return await question.update(data);
  }

  public async deleteQuestion(questionId: number): Promise<void> {
    const question = await QuestionModel.findByPk(questionId);
    if (!question) throw new HTTPException(404, 'Question not found');
    await question.destroy();
  }
}
