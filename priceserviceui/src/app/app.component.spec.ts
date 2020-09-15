import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('AppComponent', () => {
  let app: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let httpTestingController: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [HttpClientTestingModule],
      providers: [HttpClient, HttpHandler],
    }).compileComponents().then(() => {
      httpTestingController = TestBed.get(HttpTestingController);
      fixture = TestBed.createComponent(AppComponent);
      app = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it(`should have as title 'priceserviceui'`, () => {
    expect(app.title).toEqual('priceserviceui');
  });


  it('should get right URL', () => {
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

  it('should send a request to (not running) backend', () => {
    
    app.sendRequestUrl = 'assets/test.json';
    app.sendRequest();

    expect(app.consoleOutput).toContain({
      message: 'Request failed.',
      type: 'error',
    })
  });


  it('should log the right request type', () => {

    app.requestTypeSelected = 'default';
    app.logRequestType();
    expect(app.consoleOutput).toContain({
      message: 'Default type was requested',
      type: 'info',
    });
    
    app.requestTypeSelected = 'customerName';
    app.logRequestType();
    expect(app.consoleOutput).toContain({
      message: 'Customer name was requested',
      type: 'info',
    });

    app.requestTypeSelected = 'balance';
    app.logRequestType();
    expect(app.consoleOutput).toContain({
      message: 'Balance was requested',
      type: 'info',
    });
    
  });



  it('change breaker config', () => {

    let testConsecutiveBreaker:any = {
      breaker: 'consecutive',
      timeoutDuration: 10000,
      resetDuration: 10000,
      consecutiveFailures: 3,
    }

    app.configUrl = '/assets/testBreaker.json';
    app.sendBreakerConfig(testConsecutiveBreaker);

    

  });
});
