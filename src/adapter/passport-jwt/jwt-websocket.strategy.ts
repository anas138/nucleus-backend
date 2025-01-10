// jwt-ws.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { ExtractJwt } from 'passport-jwt';

@Injectable()
export class JwtWsStrategy extends PassportStrategy(Strategy, 'jwt-ws') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromUrlQueryParameter('token'), // Assuming token is passed as a query parameter
      ignoreExpiration: false, // Set to true if you want to ignore token expiration
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    // Implement your validation logic for WebSocket JWT strategy
    // This method will be called when a WebSocket connection is made with a JWT token

    // For example, you can verify if the payload contains necessary user information
    if (!payload || !payload.userId) {
      throw new UnauthorizedException('Invalid token');
    }

    // Return the user or a subset of user information if needed
    return { userId: payload.userId, username: payload.username };
  }
}
