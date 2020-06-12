import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

@Injectable()
export class AppComponent {

  constructor(private http : HttpClient) {}


  title = 'priceserviceui';
  selected = 'consecutive';
  isConsecutiveSelected: boolean = true;
  // two way binding with ui inputs
  serviceUrl : string = "http://localhost:3000/";
  backEndUrl : string = "http://localhost:3400/config/"
  threshold : number = 0.5 ;
  timeoutDuration : number = 10000;
  monitorDuration : number = 10000;
  minimumRequests : number = 1;
  consecutiveFailures : number = 3;

  
  
  selectInput(string: string) {
    let selected = string;
    if (selected == "consecutive") {
      this.isConsecutiveSelected = true;
    } else {
      this.isConsecutiveSelected = false;
    }
  }

  createBreakerConfig() {
    let breakerConfig : JSON;
    if (this.isConsecutiveSelected) {
      breakerConfig = JSON.parse('{ "breaker" : "consecutive", "timeoutDuration" : "'+ this.timeoutDuration +'", "consecutiveFailures" : "'+ this.consecutiveFailures +'"}');
    } else {
      breakerConfig = JSON.parse(
        '{ "breaker" : "sample", "timeoutDuration" : "' + this.timeoutDuration + '", "monitorDuration" : "' + this.monitorDuration + '", "threshold" : "' + this.threshold + '", "minimumRequests" : "' + this.minimumRequests + '"}');
      }
      this.sendBreakerConfig(breakerConfig);
  }

  sendBreakerConfig(json : JSON) {
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json");

      this.http.put(this.backEndUrl, json, {headers})
        .subscribe(
          val => {
            console.log("Updated the breaker config!", val)
          },
          response => {
            console.log("Error in PUT call.", response)
          },
          () => {
            console.log("Call completed.")
          }
        )
  }
}
