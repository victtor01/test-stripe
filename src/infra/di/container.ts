import "reflect-metadata";
import { METADATA_KEYS } from "./constants.ts";

type Constructor<T = any> = new (...args: any[]) => T;
type Token = string | symbol | Constructor;

class Container {
  private instances = new Map<any, any>();
  private providers = new Map<Token, Constructor>(); // Mapeia Interface (Token) -> Classe Real

  // Registra qual classe deve ser usada para qual Token (Interface)
  register<T>(token: Token, implementation: Constructor<T>) {
    this.providers.set(token, implementation);
  }

  resolve<T>(token: Token): T {
    // 1. Verifica se o token tem uma implementação mapeada (Inversão)
    const target = this.providers.get(token) || (token as Constructor);

    if (this.instances.has(target)) {
      return this.instances.get(target);
    }

    const tokens: any[] = Reflect.getMetadata(METADATA_KEYS.PARAM_TYPES, target) || [];
    
    // 2. Resolve dependências recursivamente
    const injections = tokens.map((t, index) => {
      // Verifica se existe um token específico via @Inject (opcional, para strings)
      const manualToken = Reflect.getMetadata(`custom:inject:${index}`, target);
      return this.resolve(manualToken || t);
    });

    const instance = new (target as Constructor)(...injections);
    this.instances.set(target, instance);
    return instance;
  }
}

export const container = new Container();