import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [HttpClientTestingModule, HttpClient, HttpHandler],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'priceserviceui'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('priceserviceui');
  });


  it('should get right URL', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    app.requestTypeSelected = 'default';
    app.setRequestUrl();
    expect(app.sendRequestUrl).toBe('http://localhost:3300/request');

    app.requestTypeSelected = 'customerName';
    app.setRequestUrl();
    expect(app.sendRequestUrl).toBe('http://localhost:3300/request/customer-name');

    app.requestTypeSelected = 'balance';
    app.setRequestUrl();
    expect(app.sendRequestUrl).toBe('http://localhost:3300/request/balance');

  });
});
