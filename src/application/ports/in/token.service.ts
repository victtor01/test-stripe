import { TokensPayloadDTO } from '@/application/dtos/generate-tokens.dto';
import { UserRole } from '@/domain/enums/UserRole';

export abstract class TokenService {
  abstract generateAccessToken(command: TokensPayloadDTO): Promise<string>;
  abstract generateRefreshToken(userId: string): Promise<string>;
  abstract validateToken(token: string): Promise<{ userId: string; roles: UserRole[] } | null>;
}
