import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/users.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private usersService: UsersService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID || 'client-id-placeholder',
      clientSecret:
        process.env.GOOGLE_CLIENT_SECRET || 'client-secret-placeholder',
      callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<any> {
    try {
      const user = await this.usersService.findOrCreate({
        id: profile.id,
        emails: profile.emails || [],
        displayName: profile.displayName,
        photos: profile.photos,
      });
      done(null, user);
    } catch (err) {
      done(err as Error, false);
    }
  }
}
