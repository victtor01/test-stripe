import { AsyncLocalStorage } from 'async_hooks';
import { EntityManager } from 'typeorm';

export class TransactionContext {
  private static storage = new AsyncLocalStorage<EntityManager>();

  // Executa um callback dentro de um escopo isolado com o manager
  static run(manager: EntityManager, callback: () => Promise<any>) {
    return this.storage.run(manager, callback);
  }

  // Retorna o manager da transação atual OU undefined se não houver
  static getManager(): EntityManager | undefined {
    return this.storage.getStore();
  }
}