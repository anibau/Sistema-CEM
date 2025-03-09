import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/User.entity';

import {config as dotenvConfig} from 'dotenv'
import { Role } from 'src/enum/Role.enum';

dotenvConfig();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.CALLBACKURL,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile;
    let user = await this.userRepository.findOne({
      where: { email: emails[0].value },
    });

    if (!user) {
      user = this.userRepository.create({
        email: emails[0].value,
        name: name.givenName,
        password: null,
        phone: '00000000',
        role: Role.CLIENT,
        dni: null
      });
      await this.userRepository.save(user);
    }
   
    done(null, user);
  }
}
