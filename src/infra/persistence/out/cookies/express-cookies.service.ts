import { Response } from "express";
import { CookieService } from "./cookies.service";

export class ExpressCookieService implements CookieService {
  set(res: Response, name: string, value: string, maxAge: number): void {
    res.cookie(name, value, {
      httpOnly: true, // Protege contra XSS
      secure: process.env.NODE_ENV === "production", // Só HTTPS em prod
      sameSite: "lax", // Protege contra CSRF
      maxAge: maxAge, 
      path: "/",
    });
  }

  delete(res: Response, name: string): void {
    res.clearCookie(name);
  }
}