import { EntityTarget, ObjectLiteral, Repository } from 'typeorm';
import { AppDataSource } from '../persistence/out/context/database-context';
import { TransactionContext } from './transaction-context';

export abstract class BaseRepository<T extends ObjectLiteral> {
  protected entity: EntityTarget<T>;

  constructor(entity: EntityTarget<T>) {
    this.entity = entity;
  }

  protected get repository(): Repository<T> {
    const contextManager = TransactionContext.getManager();

    if (contextManager) {
      return contextManager.getRepository(this.entity);
    }

		return AppDataSource.getRepository(this.entity);
  }
}
