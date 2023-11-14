import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    console.log('what is ctx', ctx);

    const res = ctx.getContext().req.user;

    console.log('what  is res', res);

    return res;
  },
);
