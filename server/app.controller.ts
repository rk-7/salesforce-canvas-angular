import { Body, Controller, Get, Next, Post, Render, Req, Res } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { join } from 'path';
import { AppService } from './app.service';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get('')
  getRe(@Body() data, @Res() res: Response, @Req() req: Request, @Next() next: NextFunction) {
    return res.render(join(process.cwd(), 'dist/browser'), {req, res, next});
    return 'Hellos';
  }
  @Post()
  signedRequest(@Body() data, @Res() res: Response, @Req() req: Request, @Next() next: NextFunction): any {
    // return this.appService.checkAuthenticated(data);
    return res.render(join(process.cwd(), 'dist/browser'), {req, res, next});
  }
}
