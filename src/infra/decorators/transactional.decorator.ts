import { AppDataSource } from '../persistence/out/context/database-context';
import { TransactionContext } from '../utils/transaction-context';

export function Transactional() {
  return function (_: any, __: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const existingManager = TransactionContext.getManager();
      if (existingManager) {
        return originalMethod.apply(this, args);
      }

      return AppDataSource.manager.transaction(async (entityManager) => {
        return TransactionContext.run(entityManager, async () => {
          return originalMethod.apply(this, args);
        });
      });
    };

    return descriptor;
  };
}
