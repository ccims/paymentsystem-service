import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

@Injectable()
export class AppComponent {

  constructor(private http: HttpClient) { }


  title = 'priceserviceui';
  // two way binding with ui inputs
  requestTypeSelected = 'default';
  breakerTypeSelected = 'consecutive';
  isConsecutiveSelected = true;
  serviceUrl = 'http://localhost:3000/';
  backEndUrl = 'http://localhost:3300/config/';
  sendRequestUrl = 'http://localhost:3300/request';
  threshold = 0.5;
  resetDuration = 10000;
  timeoutDuration = 10000;
  monitorDuration = 10000;
  minimumRequests = 1;
  consecutiveFailures = 3;
  consoleOutput = '';

  /**
   * Method adds the input to the output shown in the UI
   * @param input string to be added to UI output
   */
  addToOutput(input: string) {
    this.consoleOutput = this.consoleOutput + input + '\n';
  }
  /**
   * On change of the selected request type in the ui this function is called,
   * the requestUrl will be changed to the corresponding url
   */
  setRequestUrl() {
    if (this.requestTypeSelected === 'balance') {
      this.sendRequestUrl = 'http://localhost:3300/request/balance';
    } else if (this.requestTypeSelected === 'customerName') {
      this.sendRequestUrl = 'http://localhost:3300/request/customer-name';
    } else {
      this.sendRequestUrl = 'http://localhost:3300/request';
    }
    console.log(this.requestTypeSelected);
  }
  /**
   * Sends a request to the backend
   */
  sendRequest() {
    this.http.get(this.sendRequestUrl)
      .subscribe(
        val => {
          console.log('Send the request', val);
          this.logRequestType();
          this.addToOutput(JSON.stringify(val));
        },
        response => {
          this.addToOutput('Request failed.');
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
      this.addToOutput('Balance was requested');
    } else if (this.requestTypeSelected === 'customerName') {
      this.addToOutput('Customer name was requested');
    } else {
      this.addToOutput('Default type was requested');
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
        breaker: "consecutive", 
        timeoutDuration: "' + this.timeoutDuration + '",
        resetDuration : "' + this.resetDuration + '",
        consecutiveFailures : "' + this.consecutiveFailures + '"
      }
    } else {
      breakerConfig = {
        breaker : "sample",
        timeoutDuration: "' + this.timeoutDuration + '",
        resetDuration: "' + this.resetDuration + '",
        monitorDuration : "' + this.monitorDuration + '",
        threshold : "' + this.threshold + '",
        minimumRequests : "' + this.minimumRequests + '"
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
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');

    this.http.put(this.backEndUrl, json, { headers, responseType: 'text' as 'text' })
      .subscribe(
        val => {
          // this.addToOutput('New CircuitBreaker configuration: ' + JSON.stringify(json));
          this.addToOutput('CircuitBreaker updated');
          console.log('Updated the breaker config!', val);
        },
        response => {
          console.log('Error in PUT call.', response);
        },
        () => {
          console.log('Call completed.');
        }
      );
  }
}
