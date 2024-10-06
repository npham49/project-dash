import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwks from 'jwks-rsa';
import * as jwt from 'jsonwebtoken';

// The Kinde issuer URL should already be in your `.env` file
// from when you initially set up Kinde. This will fetch your
// public JSON web keys file

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly configService: ConfigService) {}

  async validateToken(token: string): Promise<any> {
    try {
      const client = new jwks.JwksClient({
        jwksUri: `${this.configService.get('kinde.issuerUrl')}/.well-known/jwks.json`,
      });
      const { header } = jwt.decode(token, { complete: true });
      const { kid } = header;

      // Verify the token
      const key = await client.getSigningKey(kid);
      const signingKey = key.getPublicKey();
      const decoded = jwt.verify(token, signingKey);

      return decoded;
    } catch (error) {
      this.logger.error(error);
      throw new UnauthorizedException(error);
    }
  }
}
