import { TokensPayloadDTO } from '@/application/dtos/generate-tokens.dto';
import { TokenService } from '@/application/ports/in/token.service';
import { UserRole } from '@/domain/enums/UserRole';
import * as jose from 'jose';

const DEV_JWT_SECRET = 'development_secret_key_please_change';

export class JoseTokenService implements TokenService {
  private readonly secret = new TextEncoder().encode(process.env.JWT_SECRET || DEV_JWT_SECRET);

  async generateAccessToken(props: TokensPayloadDTO): Promise<string> {
    return await new jose.SignJWT({ roles: props.roles })
      .setProtectedHeader({ alg: 'HS256' }) // Algoritmo padrão
      .setIssuedAt()
      .setSubject(props.userId)
      .setExpirationTime('15m') // Access token curto
      .sign(this.secret);
  }

  async generateRefreshToken(userId: string): Promise<string> {
    return await new jose.SignJWT({ sub: userId })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('30d')
      .sign(this.secret);
  }

  async validateToken(token: string): Promise<TokensPayloadDTO | null> {
    try {
      const { payload } = await jose.jwtVerify(token, this.secret);
      return { userId: payload.sub as string, roles: payload.roles as UserRole[] };
    } catch (err) {
      // O jose lança erros específicos para expiração, assinatura inválida, etc.
      return null;
    }
  }
}
