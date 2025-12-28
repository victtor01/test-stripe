import { UserRole } from '@/domain/enums/UserRole';
import 'reflect-metadata';

// Chave única para acessar o metadado depois
export const ROLES_KEY = Symbol('ROLES_KEY');

export const Roles = (...roles: UserRole[]) => {
  return (target: any, propertyKey?: string | symbol, descriptor?: PropertyDescriptor) => {
    if (propertyKey) {
      Reflect.defineMetadata(ROLES_KEY, roles, target, propertyKey);
    } else {
      Reflect.defineMetadata(ROLES_KEY, roles, target);
    }
  };
};