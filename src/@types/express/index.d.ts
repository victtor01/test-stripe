import { UserRole } from '@/domain/enums/UserRole';
import 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        roles: UserRole[];
      };
    }
  }
}
