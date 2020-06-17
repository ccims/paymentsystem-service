import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

@Injectable()
export class AppComponent {

  constructor(private http: HttpClient) {}


  title = 'priceserviceui';
  selected = 'consecutive';
  isConsecutiveSelected = true;
  // two way binding with ui inputs
  serviceUrl = 'http://localhost:3000/';
  backEndUrl = 'http://localhost:3300/config/';
  sendRequestUrl = 'http://localhost:3300/request';
  threshold = 0.5 ;
  resetDuration = 10000;
  timeoutDuration = 10000;
  monitorDuration = 10000;
  minimumRequests = 1;
  consecutiveFailures = 3;

  consoleOutput = '';
  /**
   *
   * @param input
   */
  selectInput(input: string) {
    const selected = input;
    if (selected === 'consecutive') {
      this.isConsecutiveSelected = true;
    } else {
      this.isConsecutiveSelected = false;
    }
  }
  /**
   *
   * @param input
   */
  addToOutput(input: string) {
    this.consoleOutput = this.consoleOutput + input + '\n';
  }
  /**
   *
   */
  sendRequest() {
    this.http.get(this.sendRequestUrl)
      .subscribe(
        val => {
          console.log('Send the request', val);
          this.addToOutput(JSON.stringify(val));
        },
        response => {
          this.addToOutput('Request to backend failed.');
          console.log('Error in GET call.', response);
        },
        () => {
          console.log('Call completed.');
        }
      );
  }
/**
 *
 */
  createBreakerConfig() {
    let breakerConfig: JSON;
    if (this.isConsecutiveSelected) {
      breakerConfig = JSON.parse(
        '{ "breaker" : "consecutive", "timeoutDuration" : "' + this.timeoutDuration + '", "resetDuration" : "' + this.resetDuration + '", "consecutiveFailures" : "' + this.consecutiveFailures + '"}');
    } else {
      breakerConfig = JSON.parse(
        '{ "breaker" : "sample", "timeoutDuration" : "' + this.timeoutDuration + '", "resetDuration" : "' + this.resetDuration + '", "monitorDuration" : "' + this.monitorDuration + '", "threshold" : "' + this.threshold + '", "minimumRequests" : "' + this.minimumRequests + '"}');
      }
    console.log(breakerConfig);
    this.sendBreakerConfig(breakerConfig);
  }
/**
 *
 * @param json
 */
  sendBreakerConfig(json: JSON) {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');

    this.http.put(this.backEndUrl, json, {headers, responseType : 'text' as 'text'})
        .subscribe(
          val => {
            this.addToOutput('New CircuitBreaker configuration: ' + JSON.stringify(json));
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
