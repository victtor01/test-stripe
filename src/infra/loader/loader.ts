import { UserRole } from '@/domain/enums/UserRole';
import { Router, type RequestHandler } from 'express';
import { ROLES_KEY } from '../decorators/role.decorator';
import { METADATA_KEYS, type RouteDefinition } from '../di/constants';
import { container } from '../di/container';
export function createRouter(controllers: any[]): Router {
  const router = Router();

  controllers.forEach((ControllerClass) => {
    const prefix = Reflect.getMetadata(METADATA_KEYS.CONTROLLER, ControllerClass) || '';
    const routes: RouteDefinition[] =
      Reflect.getMetadata(METADATA_KEYS.ROUTES, ControllerClass) || [];

    const instance = container.resolve(ControllerClass) as any;

    routes.forEach((route) => {
      const fullPath = (prefix + route.path).replace(/\/+/g, '/');

      // --- 1. RECUPERAÇÃO DE MIDDLEWARES (@UseMiddleware / @Use) ---
      // Já funciona no seu código original, pois pega da Classe e do Prototype
      const classMiddlewares = Reflect.getMetadata(METADATA_KEYS.MIDDLEWARE, ControllerClass) || [];
      const methodMiddlewares =
        Reflect.getMetadata(
          METADATA_KEYS.MIDDLEWARE,
          ControllerClass.prototype,
          route.handlerName,
        ) || [];

      // --- 2. RECUPERAÇÃO DE ROLES (@Roles) ---

      // A: Roles definidas na CLASSE (ex: @Roles(STUDENT) em cima do Controller)
      const classRoles: UserRole[] = Reflect.getMetadata(ROLES_KEY, ControllerClass) || [];

      // B: Roles definidas no MÉTODO (ex: @Roles(ADMIN) em cima do createLesson)
      const methodRoles: UserRole[] =
        Reflect.getMetadata(ROLES_KEY, ControllerClass.prototype, route.handlerName) || [];

      // C: Combina e remove duplicatas (Set)
      // Resultado: Lista unificada de quem pode acessar
      const requiredRoles = [...new Set([...classRoles, ...methodRoles])];

      // --- 3. CRIANDO O GUARD ---
      const roleGuard: RequestHandler = (req, res, next) => {
        // Se ninguém definiu role nenhuma, passa
        if (requiredRoles.length === 0) {
          return next();
        }

        // Verifica autenticação (AuthMiddleware deve rodar antes)
        if (!req.user || !req.user.roles) {
          return res.status(403).json({ message: 'Acesso proibido: usuário não identificado.' });
        }

        // Verifica se o usuário tem alguma das roles permitidas
        const hasRole = requiredRoles.some((role) => req.user!.roles.includes(role));

        if (!hasRole) {
          return res.status(403).json({
            message: `Acesso negado. Necessário: ${requiredRoles.join(' ou ')}`,
          });
        }

        next();
      };

      // --- 4. MONTAGEM DA CADEIA ---

      const allMiddlewares = [...classMiddlewares, ...methodMiddlewares];

      const resolvedMiddlewares = allMiddlewares.map((m: any) => {
        const isClass = typeof m === 'function' && m.prototype && m.prototype.constructor;
        if (isClass) {
          const middlewareInstance = container.resolve(m) as any;
          return middlewareInstance.handle.bind(middlewareInstance);
        }
        return m;
      });

      // Adiciona o Guard de Roles se houver restrição
      if (requiredRoles.length > 0) {
        resolvedMiddlewares.push(roleGuard);
      }

      // Handler final do Controller
      const finalHandler: RequestHandler = async (req, res, next) => {
        try {
          await instance[route.handlerName](req, res, next);
        } catch (err) {
          next(err);
        }
      };

      // Registra no Express
      (router as any)[route.method](fullPath, ...resolvedMiddlewares, finalHandler);
    });
  });

  return router;
}
