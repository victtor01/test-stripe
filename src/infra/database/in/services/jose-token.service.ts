import { TokenService } from "@/application/ports/in/token.service";
import * as jose from "jose";

export class JoseTokenService implements TokenService {
  private readonly secret = new TextEncoder().encode(process.env.JWT_SECRET!);

  async generateAccessToken(userId: string): Promise<string> {
    return await new jose.SignJWT({ sub: userId })
      .setProtectedHeader({ alg: "HS256" }) // Algoritmo padrão
      .setIssuedAt()
      .setExpirationTime("15m") // Access token curto
      .sign(this.secret);
  }

  async generateRefreshToken(userId: string): Promise<string> {
    return await new jose.SignJWT({ sub: userId })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("30d") // Refresh token longo
      .sign(this.secret);
  }

  async validateToken(token: string): Promise<{ userId: string } | null> {
    try {
      const { payload } = await jose.jwtVerify(token, this.secret);
      return { userId: payload.sub as string };
    } catch (err) {
      // O jose lança erros específicos para expiração, assinatura inválida, etc.
      return null;
    }
  }
}
