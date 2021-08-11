import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const FormToObject = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const reqBody = request.body;

    if (reqBody[data]) {
      const serialized = JSON.parse(reqBody[data]);
      return serialized;
    } else {
      console.log('return');
      return request;
    }
  },
);
