import { HttpService, Injectable, HttpException } from '@nestjs/common';
import {
  BrokenCircuitError,
  ConsecutiveBreaker,
  Policy,
  SamplingBreaker,
  TaskCancelledError,
  TimeoutStrategy,
  CircuitBreakerPolicy,
} from 'cockatiel';
import { ConfigHandlerService } from './config-handler/config-handler.service';
import { LogType, reportError } from 'logging-format';
import { ConfigService } from '@nestjs/config';

/**
 * Contains the methods for the circuitBreaker and the methods that send the http requests to the database service
 */
@Injectable()
export class AppService {
  constructor(
    private configHandlerService: ConfigHandlerService,
    private config: ConfigService,
    private httpService: HttpService,
  ) {
    this.setupBreaker();
  }

  private breaker: CircuitBreakerPolicy;

  /**
    Initializes the CircuitBreaker based on the selected configurations
    called in constructor and in config-handler.controller.ts
  */
  public setupBreaker() {
    if (this.configHandlerService.breakerType == 'consecutive') {
      /*
       * Constructor for the consecutiveBreaker
       * The ConsecutiveBreaker breaks after n requests in a row fail
       * More info at https://github.com/connor4312/cockatiel#consecutivebreaker
       */
      this.breaker = Policy.handleAll().circuitBreaker(
        this.configHandlerService.resetDuration,
        new ConsecutiveBreaker(this.configHandlerService.consecutiveFailures),
      );
    } else {
      /*
       * Constructor for the samplingBreaker
       * The SamplingBreaker breaks after a proportion of requests over a time period fail
       * More infos at https://github.com/connor4312/cockatiel#samplingbreaker
       */
      this.breaker = Policy.handleAll().circuitBreaker(
        this.configHandlerService.resetDuration,
        new SamplingBreaker({
          threshold: this.configHandlerService.threshold,
          duration: this.configHandlerService.monitorDuration,
          minimumRps: this.configHandlerService.minimumRequests,
        }),
      );
    }
  }

  /**
   * Calls the handleTimeout() function and inserts the returned result into the
   * return value if the underlying get request to the database service was successful.
   * Otherwise, an ErrorFormat Object will be reported to the error-monitor and an HttpException is thrown with this ErrorFormat Object
   *
   * @param url request destination
   *
   * @returns JSON with properties type, message and result where type takes the value of "Success" if no
   * error has been experienced, message denotes the successful procedure and result takes on the fetched
   * value of the underlying get request to the database service
   */
  public async handleRequest(url: string): Promise<any> {
    try {
      console.log(url);
      const data = await this.breaker.execute(() => this.handleTimeout(url));
      return {
        type: 'Success',
        message: 'Request to database was successful',
        result: data,
      };
    } catch (error) {
      if (error instanceof BrokenCircuitError) {
        throw new HttpException(
          reportError({
            correlationId: null,
            log: {
              type: LogType.CB_OPEN,
              time: Date.now(),
              message: 'CircuitBreaker is open.',
              detectorUrl: this.config.get<string>("URL", "http://localhost:3300/"),
              sourceUrl: this.config.get<string>("BACKEND_DB_SERVICE_URL", "http:/localhost:3000/"),
              data: {
                openTime: this.configHandlerService.resetDuration,
                failedResponses: this.configHandlerService.consecutiveFailures,
              },
            },
          }, this.config.get<string>("BACKEND_RESPONSE_MONITOR_URL", "http://localhost:3400/")),
          503,
        );
      } else if (error instanceof TaskCancelledError) {
        throw new HttpException(
          reportError({
            correlationId: null,
            log: {
              type: LogType.TIMEOUT,
              time: Date.now(),
              message: 'Request was timed out.',
              detectorUrl: this.config.get<string>("URL", "http://localhost:3300/"),
              sourceUrl: this.config.get<string>("BACKEND_DB_SERVICE_URL", "http:/localhost:3000/"),
              data: {
                timeoutDuration: this.configHandlerService.timeoutDuration,
              },
            },
          }, this.config.get<string>("BACKEND_RESPONSE_MONITOR_URL", "http://localhost:3400/")),
          503,
        );
      } else {
        if (error.error?.correlationId === undefined) {
          // new error occurred
          throw new HttpException(
            reportError({
              correlationId: null,
              log: {
                detectorUrl: this.config.get<string>("URL", "http://localhost:3300/"),
                sourceUrl: this.config.get<string>("BACKEND_DB_SERVICE_URL", "http:/localhost:3000/"),
                time: Date.now(),
                type: LogType.ERROR,
                data: {
                  expected: 'Not an error',
                  actual: error.message,
                },
              },
            }, this.config.get<string>("BACKEND_RESPONSE_MONITOR_URL", "http://localhost:3400/")),
            503,
          );
        } else {
          // error occurred before
          throw new HttpException(reportError(error.error, this.config.get<string>("BACKEND_RESPONSE_MONITOR_URL", "http://localhost:3400/")), 503);
        }
      }
    }
  }

  /**
   * Calls the function that sends a request to the database via a timeout function and
   * extracts the returned result
   * Will timeout the function call if the configured time is exceeded
   *
   * @param url request destination
   *
   * @returns the result extracted from the function sendrequest()
   */
  public async handleTimeout(url: string) {
    let result;
    try {
      const timeout = Policy.timeout(
        this.configHandlerService.timeoutDuration,
        TimeoutStrategy.Aggressive,
      );

      const data = await timeout.execute(async () => {
        result = await this.sendRequest(url);
      });
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Sends a get request to the specified endpoint of the database service
   * This endpoint will be determined in the router handler functions in
   * the app controller
   *
   * @param url request destination
   *
   * @returns Returns the fetched data of the get request if request was successful
   * and an error otherwise
   */
  public async sendRequest(url: string) {
    try {
      const send = await this.httpService.get(url).toPromise();
      if (send.status == 200) {
        console.log(`Request to ${url} was successful`);
      }
      return send.data;
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
