import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigHandlerService } from './config-handler/config-handler.service';

/**
 * This component receives the calls from the frontend to send requests to the database service
 */
@Controller('request')
export class AppController {
  constructor(private readonly appService: AppService,
              private readonly configHandlerService : ConfigHandlerService) {}
  /**
   * Handles get requests to the default url of database service
   */
  @Get()
  sendRequest() {
    this.configHandlerService.databaseUrl = 'http://localhost:3000/';
    return this.appService.handleRequest();
  }
  /**
   * Handles get requests to receive balance from database service
   */
  @Get('balance')
  getBalance() {
    this.configHandlerService.databaseUrl = 'http://localhost:3000/request-handler/balance';
    return this.appService.handleRequest();
  }
  /**
   * Handles get requests to receive customer name from database service
   */
  @Get('customer-name')
  getCustomerName() {
    this.configHandlerService.databaseUrl ='http://localhost:3000/request-handler/customer-name';
    return this.appService.handleRequest();
  }
}
