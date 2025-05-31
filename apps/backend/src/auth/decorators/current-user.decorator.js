import { createParamDecorator } from '@nestjs/common';
export const CurrentUser = createParamDecorator((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
});
