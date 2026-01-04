import { OptionModel } from '../model/optionmodel';
import { HTTPException } from '../exceptions/http.exception';

export class OptionService {
  public async findOptionsByQuestionId(questionId: number): Promise<OptionModel[]> {
    return await OptionModel.findAll({ where: { question_id: questionId } });
  }

  public async createOption(data: any): Promise<OptionModel> {
    return await OptionModel.create(data);
  }

  public async deleteOption(optionId: number): Promise<void> {
    const option = await OptionModel.findByPk(optionId);
    if (!option) throw new HTTPException(404, 'Option not found');
    await option.destroy();
  }
}
