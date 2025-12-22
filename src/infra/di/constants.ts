export const METADATA_KEYS = {
  CONTROLLER: "custom:controller",
  ROUTES: "custom:routes",
  MIDDLEWARE: "custom:middleware",
  INJECTABLE: "custom:injectable",
  PARAM_TYPES: "design:paramtypes",
};

export type HttpMethod = "get" | "post" | "put" | "delete" | "patch";

export interface RouteDefinition {
  method: HttpMethod;
  path: string;
  handlerName: string | symbol;
}