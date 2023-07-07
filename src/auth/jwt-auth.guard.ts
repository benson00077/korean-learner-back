import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly configService: ConfigService) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const httpContext = context.switchToHttp();
    const { method, url } = httpContext.getRequest<Request>();
    const handler = context.getHandler().name;
    const className = context.getClass().name;

    if (
      this.configService.get('NODE_ENV') === 'development' &&
      this.configService.get('JWT_NO_GUARD')
    ) {
      Logger.verbose(
        `Skipping JwtAuthGuard: ${method} ${url}`,
        `${className} -> ${handler}`,
      );
      return true;
    }

    if (
      this.configService.get('NODE_ENV') === 'development' &&
      !this.configService.get('JWT_NO_GUARD')
    ) {
      Logger.verbose(
        `User passed by JwtAuthGuard`,
        `${className} -> ${handler}`,
      );
    }
    return super.canActivate(context);
  }
}
