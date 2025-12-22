import { Router, type RequestHandler } from "express";
import { METADATA_KEYS, type RouteDefinition } from "../di/constants";
import { container } from "../di/container";

export function createRouter(controllers: any[]): Router {
  const router = Router();

  controllers.forEach((ControllerClass) => {
    const prefix =
      Reflect.getMetadata(METADATA_KEYS.CONTROLLER, ControllerClass) || "";
    const routes: RouteDefinition[] =
      Reflect.getMetadata(METADATA_KEYS.ROUTES, ControllerClass) || [];

    const instance = container.resolve(ControllerClass) as any;

    routes.forEach((route) => {
      const fullPath = (prefix + route.path).replace(/\/+/g, "/");

      const classMiddlewares: RequestHandler[] =
        Reflect.getMetadata(METADATA_KEYS.MIDDLEWARE, ControllerClass) || [];
      const methodMiddlewares: RequestHandler[] =
        Reflect.getMetadata(
          METADATA_KEYS.MIDDLEWARE,
          ControllerClass.prototype,
          route.handlerName
        ) || [];

      const allMiddlewares = [...classMiddlewares, ...methodMiddlewares];

      const finalHandler: RequestHandler = async (req, res, next) => {
        try {
          await instance[route.handlerName](req, res, next);
        } catch (err) {
          next(err);
        }
      };

      // 2. Registra no Express: router.get(path, ...mids, handler)
      (router as any)[route.method](fullPath, ...allMiddlewares, finalHandler);
    });
  });

  return router;
}
