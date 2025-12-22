import type { RequestHandler } from "express";
import { METADATA_KEYS } from "../di/constants.ts";

export function Use(...middlewares: RequestHandler[]): any {
  return (target: any, propertyKey?: string | symbol) => {
    if (propertyKey) {
      // Decorator de Método
      Reflect.defineMetadata(METADATA_KEYS.MIDDLEWARE, middlewares, target, propertyKey);
    } else {
      // Decorator de Classe
      Reflect.defineMetadata(METADATA_KEYS.MIDDLEWARE, middlewares, target);
    }
  };
}