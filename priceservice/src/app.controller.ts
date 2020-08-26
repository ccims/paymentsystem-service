import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppService } from './app.service';

/**
 * This component receives the calls from the frontend to send requests to the database service
 */
@Controller('request')
export class AppController {
  databaseUrl: string;

  constructor(private readonly appService: AppService, private configService: ConfigService) {
    this.databaseUrl = configService.get<string>("BACKEND_DB_SERVICE_URL", "http:/localhost:3000/");
  }
  /**
   * Handles get requests to the default url of database service
   */
  @Get()
  sendRequest() {
    return this.appService.handleRequest(this.databaseUrl);
  }
  /**
   * Handles get requests to receive balance from database service
   */
  @Get('balance')
  getBalance() {
    return this.appService.handleRequest(this.databaseUrl + 'request-handler/balance');
  }
  /**
   * Handles get requests to receive customer name from database service
   */
  @Get('customer-name')
  getCustomerName() {
    return this.appService.handleRequest(this.databaseUrl + 'request-handler/customer-name');
  }

  /**
   * The request sent by the account service will go to this endpoint and
   * will be transferred to the database service. A timeout interceptor is also
   * bind to this router handler that will throw a timeout exception after 5 seconds.
   */
  @Get('account-worth')
  requestAccountValue() {
    return this.appService.handleRequest(this.databaseUrl + 'account-worth');
  }
}
