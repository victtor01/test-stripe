import {
  METADATA_KEYS,
  type HttpMethod,
  type RouteDefinition,
} from "../di/constants.ts";
import { normalizePath } from "../utils/normalize-path.ts";

export function Controller(prefix: string = ""): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(METADATA_KEYS.CONTROLLER, prefix, target);
  };
}

function createRouteDecorator(method: HttpMethod) {
  return (path?: string): MethodDecorator => {
    return (
      target: any,
      propertyKey: string | symbol,
      descriptor: PropertyDescriptor
    ) => {
      const controllerClass = target.constructor;

      const routes: RouteDefinition[] =
        Reflect.getMetadata(METADATA_KEYS.ROUTES, controllerClass) || [];

      routes.push({
        method,
        path: normalizePath(path),
        handlerName: propertyKey,
      });

      Reflect.defineMetadata(METADATA_KEYS.ROUTES, routes, controllerClass);

      return descriptor;
    };
  };
}

export const Get = createRouteDecorator("get");
export const Post = createRouteDecorator("post");
export const Put = createRouteDecorator("put");
export const Delete = createRouteDecorator("delete");
