export abstract class CookieService {
  abstract set(res: any, name: string, value: string, maxAge: number): void;
  abstract delete(res: any, name: string): void;
}