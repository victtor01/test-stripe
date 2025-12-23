import type { RequestHandler } from "express";
import { METADATA_KEYS } from "../di/constants";

export function Use(...middlewares: RequestHandler[]): any {
  return (target: any, propertyKey?: string | symbol) => {
    if (propertyKey) {
      Reflect.defineMetadata(METADATA_KEYS.MIDDLEWARE, middlewares, target, propertyKey);
    } else {
      Reflect.defineMetadata(METADATA_KEYS.MIDDLEWARE, middlewares, target);
    }
  };
}