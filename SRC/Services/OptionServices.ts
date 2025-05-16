import { Service } from 'typedi';
import { OptionModel } from '../model/OptionModel';
import { HTTPException } from '../exceptions/HTTPException';

@Service()
export class OptionService {
  public async findOptionsByQuestionId(questionId: number): Promise<OptionModel[]> {
    return await OptionModel.findAll({ where: { questionId } });
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
