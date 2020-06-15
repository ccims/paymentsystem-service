import { Injectable, HttpService } from '@nestjs/common';
import { Policy, ConsecutiveBreaker, SamplingBreaker, BrokenCircuitError, TimeoutStrategy, TaskCancelledError, CancellationToken } from "cockatiel";
import { ConfigHandlerService } from './config-handler/config-handler.service';

@Injectable()
export class AppService {

  constructor(private configHandlerService : ConfigHandlerService,
              private httpService : HttpService) {}

  private consecutiveBreaker = Policy.handleAll().circuitBreaker(
    this.configHandlerService.timeoutDuration, new ConsecutiveBreaker(this.configHandlerService.consecutiveFailures));

  private samplingBreaker = Policy.handleAll().circuitBreaker(this.configHandlerService.timeoutDuration,
     new SamplingBreaker({threshold :this.configHandlerService.threshold, duration : this.configHandlerService.monitorDuration,
       minimumRps : this.configHandlerService.minimumRequests}));
  
  private timeout = Policy.timeout(this.configHandlerService.timeoutDuration, TimeoutStrategy.Aggressive);

  sendError(data: JSON) {
    this.httpService.post(this.configHandlerService.monitorUrl, data).subscribe(
      res => console.log(`Report sent to monitor at ${this.configHandlerService.monitorUrl}`),
      err => console.log(`Monitor at ${this.configHandlerService.monitorUrl} not available`),
    );
  }

  async handleRequest() {
    try {
      if (this.configHandlerService.breakerType == 'consecutive') {
        const data = await this.consecutiveBreaker.execute(() => this.handleTimeout());
      } else {
        const data = await this.samplingBreaker.execute(() => this.handleTimeout());
      } 
    } catch (error) {
        if (error instanceof BrokenCircuitError) {
          
        } else if (error instanceof TaskCancelledError) {
          
        } else {
          
        }
        this.sendError(JSON.parse('error'));
    }
  }
  async handleTimeout() {
    try {
        const data = await this.timeout.execute(() => this.sendToDatabase());
    } catch (error) {
      return Promise.reject(error)
        }
  }
              
  async sendToDatabase() {
    try {
      const send = await this.httpService.get(this.configHandlerService.databaseUrl).toPromise();
      if (send.status == 200) {
        console.log('Request to database was successful')
      }
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

