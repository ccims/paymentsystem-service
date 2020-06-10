import { Component } from '@angular/core';

interface Breaker {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'priceserviceui';
  selected = 'consecutive';
  breakers: Breaker[] = [
    {value: 'consecutive', viewValue: 'ConsecutiveBreaker'},
    {value: 'sampling', viewValue: 'SamplingBreaker'}
  ];
  
  isConsecutiveSelected: boolean = true;
  selectInput(string: string) {
    let selected = string;
    if (selected == "consecutive") {
      this.isConsecutiveSelected = true;
    } else {
      this.isConsecutiveSelected = false;
    }
  }
}
