import { Service } from 'typedi';
import { QuestionModel } from '../model/QuestionModel';
import { HTTPException } from '../exceptions/HTTPException';

@Service()
export class QuestionService {
  public async findAllBySurveyId(surveyId: number): Promise<QuestionModel[]> {
    return await QuestionModel.findAll({ where: { survey_id: surveyId } });
  }
 
   public async findQuestionBySurveyId(surveyId: number): Promise<any> {
    // Add logic to fetch questions by surveyId
    return []; // Replace with actual implementation
  }

  public async createQuestion(data: any): Promise<QuestionModel> {
    return await QuestionModel.create(data);
  }

  public async deleteQuestion(questionId: number): Promise<void> {
    const question = await QuestionModel.findByPk(questionId);
    if (!question) throw new HTTPException(404, 'Question not found');
    await question.destroy();
  }

  public async updateQuestionById(questionId: number, data: any): Promise<QuestionModel> {
    const question = await QuestionModel.findByPk(questionId);
    if (!question) throw new HTTPException(404, 'Question not found');
    return await question.update(data);
  }
}
