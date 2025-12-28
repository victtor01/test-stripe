import { TokenService } from '@/application/ports/in/token.service';
import { Injectable } from '@/infra/decorators/injectable.decorator';
import type { NextFunction, Request, Response } from 'express';

@Injectable()
export class AuthMiddleware {
  constructor(private readonly tokenService: TokenService) {}

  public handle = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.access_token || req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized', message: 'Token ausente' });
    }

    try {
      const decoded = await this.tokenService.validateToken(token);

      if (!decoded) {
        return res.status(401).json({ error: 'Unauthorized', message: 'Token inválido' });
      }

      req.user = { id: decoded.userId, roles: decoded.roles || [] };
      next();
    } catch (error) {
      return res.status(401).json({ error: 'Unauthorized', message: 'Falha na autenticação' });
    }
  };
}
