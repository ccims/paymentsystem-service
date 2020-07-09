import { HttpService, Injectable } from '@nestjs/common';
import {
  BrokenCircuitError,
  ConsecutiveBreaker,
  Policy,
  SamplingBreaker,
  TaskCancelledError,
  TimeoutStrategy,
} from 'cockatiel';
import { ConfigHandlerService } from './config-handler/config-handler.service';
import { LogMessageFormat, LogType } from 'logging-format';
import { time } from 'console';
/**
 * Contains the methods for the circuitBreaker and the methods that send the http requests to the database service
 */
@Injectable()
export class AppService {
  constructor(
    private configHandlerService: ConfigHandlerService,
    private httpService: HttpService,
  ) {}
  /**
   * Constructor for the consecutiveBreaker
   * The ConsecutiveBreaker breaks after n requests in a row fail
   * More info at https://github.com/connor4312/cockatiel#consecutivebreaker
   */
  private consecutiveBreaker = Policy.handleAll().circuitBreaker(
    this.configHandlerService.resetDuration,
    new ConsecutiveBreaker(this.configHandlerService.consecutiveFailures),
  );
  /**
   * Constructor for the samplingBreaker
   * The SamplingBreaker breaks after a proportion of requests over a time period fail
   * More infos at https://github.com/connor4312/cockatiel#samplingbreaker
   */
  private samplingBreaker = Policy.handleAll().circuitBreaker(
    this.configHandlerService.resetDuration,
    new SamplingBreaker({
      threshold: this.configHandlerService.threshold,
      duration: this.configHandlerService.monitorDuration,
      minimumRps: this.configHandlerService.minimumRequests,
    }),
  );
  /**
   * Constructor for the timeout
   * The configured duration specifies how long the timeout waits before timing out
   * the executed function
   */
  private timeout = Policy.timeout(
    this.configHandlerService.timeoutDuration,
    TimeoutStrategy.Aggressive,
  );

  /**
   * Method that updates the breaker and timeout components
   *
   * Cant be called from config-handler-service so there is no import circle appService --> configHandlerService --> appService.
   * Has to be checked via the configWasUpdated boolean.
   */
  public updateConfig() {
    this.consecutiveBreaker = Policy.handleAll().circuitBreaker(
      this.configHandlerService.resetDuration,
      new ConsecutiveBreaker(this.configHandlerService.consecutiveFailures),
    );

    this.samplingBreaker = Policy.handleAll().circuitBreaker(
      this.configHandlerService.resetDuration,
      new SamplingBreaker({
        threshold: this.configHandlerService.threshold,
        duration: this.configHandlerService.monitorDuration,
        minimumRps: this.configHandlerService.minimumRequests,
      }),
    );

    this.timeout = Policy.timeout(
      this.configHandlerService.timeoutDuration,
      TimeoutStrategy.Aggressive,
    );
  }

  /**
   * Sends data that is put in to the error monitor.
   * Prints success or failure of the http call to the console
   */
  private sendError(log: LogMessageFormat) {
    let logMsg: LogMessageFormat = {
      type: log.type,
      time: log.time,
      source: log.source,
      detector: log.detector,
      message: log.message,
      data: log.data,
    };
    this.httpService
      .post(this.configHandlerService.monitorUrl, logMsg)
      .subscribe(
        res =>
          console.log(
            `Report sent to monitor at ${this.configHandlerService.monitorUrl}`,
          ),
        err =>
          console.log(
            `Monitor at ${this.configHandlerService.monitorUrl} not available`,
          ),
      );
    return logMsg;
  }
  /**
   * Calling the timeout function via a circuitBreaker
   * Type of circuitBreaker used depends on the config
   * Handles the errors that occur and sends a log to the monitor
   */
  public async handleRequest() {
    if (this.configHandlerService.configWasUpdated === true) {
      this.updateConfig();
      this.configHandlerService.configWasUpdated = false;
    }
    try {
      if (this.configHandlerService.breakerType == 'consecutive') {
        const data = await this.consecutiveBreaker.execute(() => {
          return this.handleTimeout();
        });
        return JSON.parse(
          `{"type" : "Success", "message" : "Request to database was successful", "result": "${data}" }`,
        );
      } else {
        const data = await this.samplingBreaker.execute(() =>
          this.handleTimeout(),
        );
        return JSON.parse(
          `{"type" : "Success", "message" : "Request to database was successful", "result": "${data}" }`,
        );
      }
    } catch (error) {
      if (error instanceof BrokenCircuitError) {
        const log = {
          type: LogType.CB_OPEN,
          time: Date.now(),
          message: 'CircuitBreaker is open.',
          source: 'Database Service',
          detector: 'Price Service',
          data: {
            openTime: this.configHandlerService.resetDuration,
            failedResponses: this.configHandlerService.consecutiveFailures,
          },
        };
        return this.sendError(log);
      } else if (error instanceof TaskCancelledError) {
        const log = {
          type: LogType.TIMEOUT,
          time: Date.now(),
          message: 'Request was timed out.',
          source: 'Database Service',
          detector: 'Price Service',
          data: {
            timeoutDuration: this.configHandlerService.timeoutDuration,
          },
        };
        return this.sendError(log);
      } else {
        const log = {
          type: LogType.ERROR,
          time: Date.now(),
          message: 'Service is not available.',
          source: 'Database Service',
          detector: 'Price Service',
          data: {
            expected: 'Not an error',
            result: error.message,
          },
        };
        return this.sendError(log);
      }
    }
  }
  /**
   * Calls the function that sends a request to the database via a timeout function
   * Will timeout the function call if the configured time is exceeded
   */
  private async handleTimeout() {
    let result;
    try {
      const data = await this.timeout.execute(async () => {
        result = await this.sendToDatabase();
      });
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  }
  /**
   * Sends a get request to the database service
   *
   * @returns Returns the error
   */
  private async sendToDatabase() {
    try {
      const send = await this.httpService
        .get(this.configHandlerService.databaseUrl)
        .toPromise();
      if (send.status == 200) {
        console.log('Request to database was successful');
      }
      return send.data;
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
