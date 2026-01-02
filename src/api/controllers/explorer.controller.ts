import { FindAllInstructorsUseCase } from '@/application/usecases/explorer/find-all-instructors/find-all-instructors.usecase';
import { Controller, Get } from '@/infra/decorators/controller.decorator';
import { Request, Response } from 'express';

@Controller('/explorer')
export class ExplorerController {
  constructor(private readonly findAllInstructorsUseCase: FindAllInstructorsUseCase) {}

  @Get('/instructors')
  public async create(req: Request, res: Response): Promise<void> {
    const all = await this.findAllInstructorsUseCase.execute();

    res.json(all);
  }
}
