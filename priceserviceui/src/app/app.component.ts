import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';

/**
 * All Log outputs to the frontend are using this format.
 * Message field delivers the content while the type field is used to inform the user what type of message is output. 
 * depending on its type the output will change its color (see app-component html output field).
 */
interface LogOutput {
  message: string;
  type: string;
}


/**
 * This component handles user inputs and sends them to the price service backend, like
 * Circuit Breaker configurations and requests to the database service.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
@Injectable()
export class AppComponent {
  constructor(private http: HttpClient) { }

  title = 'priceserviceui';
  // two way binding with ui inputs
  requestTypeSelected = 'default';
  breakerTypeSelected = 'consecutive';
  isConsecutiveSelected = true;
  backEndUrl = environment.BACKEND_PRICE_SRVICE_URL;
  sendRequestUrl = this.backEndUrl + 'request';
  configUrl =  this.backEndUrl + 'config';
  threshold = 0.5;
  resetDuration = 10000;
  timeoutDuration = 10000;
  monitorDuration = 10000;
  minimumRequests = 1;
  consecutiveFailures = 3;
  consoleOutput: LogOutput[] = [];

  /**
   * On change of the selected request type in the ui this function is called,
   * the requestUrl will be changed to the corresponding url
   */
  setRequestUrl() {
    if (this.requestTypeSelected === 'balance') {
      this.sendRequestUrl = this.backEndUrl + 'request/balance';
    } else if (this.requestTypeSelected === 'customerName') {
      this.sendRequestUrl = this.backEndUrl + 'request/customer-name';
    } else if (this.requestTypeSelected === 'accountWorth') {
      this.sendRequestUrl = this.backEndUrl + 'request/account-worth';
    } else {
      this.sendRequestUrl = this.backEndUrl + 'request';
    }
    console.log(this.requestTypeSelected);
  }

  
  /**
   * Sends a request to the backend
   */
  sendRequest() {
    this.logRequestType();
    this.http.get(this.sendRequestUrl).subscribe(
      (val: any) => {
        console.log('Send the request', val);
        this.consoleOutput.push({
          message: `${val.message}, Result: ${val.result}`,
          type: 'success',
        });
      },
      (response) => {
        this.consoleOutput.push({
          message: 'Request failed.',
          type: 'error',
        });
        console.log('Error in GET call.', response);
      },
      () => {
        console.log('Call completed.');
      }
    );
  }


  /**
   * Logs in the output which request type was send
   */
  logRequestType() {
    if (this.requestTypeSelected === 'balance') {
      this.consoleOutput.push({
        message: 'Balance was requested',
        type: 'info',
      });
    } else if (this.requestTypeSelected === 'customerName') {
      this.consoleOutput.push({
        message: 'Customer name was requested',
        type: 'info',
      });
    } else {
      this.consoleOutput.push({
        message: 'Default type was requested',
        type: 'info',
      });
    }
  }

  /**
   * Creates the config for the circuitBreaker and is then send to the backend
   * via a post request
   */
  createBreakerConfig() {
    let breakerConfig;
    if (this.breakerTypeSelected === 'consecutive') {
      breakerConfig = {
        breaker: 'consecutive',
        timeoutDuration: this.timeoutDuration,
        resetDuration: this.resetDuration,
        consecutiveFailures: this.consecutiveFailures,
      };
    } else {
      breakerConfig = {
        breaker: 'sample',
        timeoutDuration: this.timeoutDuration,
        resetDuration: this.resetDuration,
        monitorDuration: this.monitorDuration,
        threshold: this.threshold,
        minimumRequests: this.minimumRequests,
      };
    }
    console.log(breakerConfig);
    this.sendBreakerConfig(breakerConfig);
  }


  /**
   * Sends the given config to the backend
   *
   * @param json config to be send to backend
   */
  sendBreakerConfig(json: JSON) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    this.http.put(this.configUrl, json, { headers, responseType: 'text' as 'text' })
      .subscribe(
        (val) => {
          this.consoleOutput.push({
            message: 'CircuitBreaker updated',
            type: 'config',
          });
          console.log('Updated the breaker config!', val);
        },
        (response) => {
          console.log('Error in PUT call.', response);
        },
        () => {
          console.log('Call completed.');
        }
      );
  }
}
