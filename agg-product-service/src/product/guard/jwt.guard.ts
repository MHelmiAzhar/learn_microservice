import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
//import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AUTH_SERVICE } from 'src/constants/service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    //private jwtService: JwtService,
    private config: ConfigService,
    @Inject(AUTH_SERVICE) private authClient: ClientProxy,
  ) {}
  async canActivate(context: ExecutionContext): Promise<any> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid token');
    }

    const token = authHeader.slice(7, authHeader.length);
    try {
      const authToken$ = this.authClient.send('validate_token', token);
      const authToken = await firstValueFrom(authToken$);

      request.user = authToken;
      return true;
    } catch (error) {
      throw error;
    }
  }
}
