import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigHandlerService } from './config-handler/config-handler.service';

/**
 * This component receives the calls from the frontend to send requests to the database service
 */
@Controller('request')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configHandlerService: ConfigHandlerService,
  ) {}
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
    this.configHandlerService.databaseUrl =
      'http://localhost:3000/request-handler/balance';
    return this.appService.handleRequest();
  }
  /**
   * Handles get requests to receive customer name from database service
   */
  @Get('customer-name')
  getCustomerName() {
    this.configHandlerService.databaseUrl =
      'http://localhost:3000/request-handler/customer-name';
    return this.appService.handleRequest();
  }

  /**
   * The request sent by the account service will go to this endpoint and
   * will be transferred to the database service. A timeout interceptor is also
   * bind to this router handler that will throw a timeout exception after 5 seconds.
   */
  @Get('account-worth')
  async requestAccountValue() {
    this.configHandlerService.databaseUrl =
      'http://localhost:3000/account-worth';
    return this.appService.handleRequest();
  }
}
