import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { response } from 'express';

@Controller('request')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  sendRequest() {
    return this.appService.handleRequest();
  }
}
