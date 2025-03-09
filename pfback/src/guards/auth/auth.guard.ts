import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    console.log(request);
    const auth = request.headers['authorization'];
    console.log(auth);

    if (!auth) {
      throw new UnauthorizedException('No tenes acceso');
    }

    try {
      const token = auth.split(' ')[1];

      const payload = this.jwt.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      request.user = payload;

      return true;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
