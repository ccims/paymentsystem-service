import { Controller, Get, Res, Header, Req, HttpService, HttpException } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigHandlerService } from './config-handler/config-handler.service';
import { Response } from 'express';
import { ErrorFormat } from'error-reporter';

/**
 * This component receives the calls from the frontend to send requests to the database service
 */
@Controller('request')
export class AppController {
  constructor(private readonly appService: AppService, private httpsService: HttpService) {}
  /**
   * Handles get requests to the default url of database service
   */
  @Get()
  sendRequest() {
    return this.appService.handleRequest("http://localhost:3000/");
  }
  /**
   * Handles get requests to receive balance from database service
   */
  @Get('balance')
  getBalance() {
    return this.appService.handleRequest("http://localhost:3000/request-handler/balance");
  }
  /**
   * Handles get requests to receive customer name from database service
   */
  @Get('customer-name')
  getCustomerName() {
    return this.appService.handleRequest('http://localhost:3000/request-handler/customer-name');
  }

  /**
   * The request sent by the account service will go to this endpoint and
   * will be transferred to the database service. A timeout interceptor is also
   * bind to this router handler that will throw a timeout exception after 5 seconds.
   */
  @Get('account-worth')
  async requestAccountValue(@Res() res: Response) {

    // console.log("ASDads")

    // return res.status(500).send({
    //   "message": "Nahh fam"
    // })

    return this.appService.handleRequest('http://localhost:3000/account-worth');
    // response.setHeader("authorization", "asdad");

    // response.status(200).send();
    // try {
    //   const res = await this.httpsService.get("http://localhost:3000/account-worth").toPromise()
    //   console.log("'''")
    //   return res;
    // } catch (error) {
    //   console.log("throw");
    //   // return error;
    //   throw new HttpException(
    //     {
    //       "message": "Not available",
    //       "correlationId": "asdaddadsa"
    //     },
    //     500
    //   );
    // }
  }
}
