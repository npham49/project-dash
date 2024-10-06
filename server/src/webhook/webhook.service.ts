import { Injectable } from '@nestjs/common';

import * as jwks from 'jwks-rsa';
import * as jwt from 'jsonwebtoken';
import { UserService } from 'src/user/user.service';

// The Kinde issuer URL should already be in your `.env` file
// from when you initially set up Kinde. This will fetch your
// public JSON web keys file
const client = new jwks.JwksClient({
  jwksUri: `${process.env.KINDE_ISSUER_URL}/.well-known/jwks.json`,
});

@Injectable()
export class WebhookService {
  constructor(private readonly userService: UserService) {}

  async processKindeWebhook(token: string): Promise<any> {
    try {
      // Decode the token
      const { header } = jwt.decode(token, { complete: true });
      const { kid } = header;

      // Verify the token
      const key = await client.getSigningKey(kid);
      const signingKey = key.getPublicKey();
      const event = jwt.verify(token, signingKey);

      if (typeof event === 'string') {
        throw new Error('Invalid event type');
      }

      // Handle various events
      switch (event?.type) {
        case 'user.updated':
          const currentUser = await this.userService.userByKindeId(
            event.data.user.id,
          );

          if (!currentUser) {
            const newUser = await this.userService.createUser({
              kindeId: event.data.user.id,
              email: event.data.user.email,
              firstName: event.data.user.first_name,
              lastName: event.data.user.last_name,
              username: event.data.user.username,
            });

            return newUser;
          } else {
            const updatedUser = await this.userService.updateUser({
              where: { id: currentUser.id },
              data: {
                email: event.data.user.email,
                firstName: event.data.user.first_name,
                lastName: event.data.user.last_name,
                username: event.data.user.username,
              },
            });

            return updatedUser;
          }
        case 'user.created':
          const newUser = await this.userService.createUser({
            kindeId: event.data.user.id,
            email: event.data.user.email,
            firstName: event.data.user.first_name,
            lastName: event.data.user.last_name,
            username: event.data.user.username,
          });

          return newUser;
        default:
          // other events that we don't handle
          break;
      }
      return { message: 'Webhook received and processed successfully' };
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
        throw new Error(err.message);
      }
    }
  }
}
