import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/user/user.schema';

type TypeData = keyof User;

export const UserDecorator = createParamDecorator(
  (data: TypeData, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);
