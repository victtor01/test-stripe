export abstract class TokenService {
  abstract generateAccessToken(userId: string): Promise<string>;
  abstract generateRefreshToken(userId: string): Promise<string>;
  abstract validateToken(token: string): Promise<{ userId: string } | null>;
}