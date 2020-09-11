import { AppService } from './app.service';
import { TestingModule, Test, TestingModuleBuilder } from '@nestjs/testing';
import { ConfigHandlerService } from './config-handler/config-handler.service';
import { HttpModule, HttpException } from '@nestjs/common';
import { error } from 'console';
import { ConfigService } from '@nestjs/config';

describe('AppService', () => {
  let appService: AppService;
  let configHandlerService: ConfigHandlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [AppService, ConfigHandlerService, ConfigService],
    }).compile();

    appService = module.get<AppService>(AppService);
    configHandlerService= module.get<ConfigHandlerService>(ConfigHandlerService);
  });

  it('should be defined', () => {
    expect(appService).toBeDefined;
  });

  it('should report successful request', async () => {
    let testUrl = 'http://localhost:3000/request-handler/balance';
    let expectedResult = {
      message: 'Request to database was successful',
      result: '31',
      type: 'Success',
    };
    jest
      .spyOn(appService, 'sendRequest')
      .mockImplementation(() => Promise.resolve('31'));
    expect(await appService.handleRequest(testUrl)).toEqual(expectedResult);
  });

  it('should throw Http Exception due to failed request', async () => {
    let testUrl = 'http://localhost:3000/request-handler/balance';
    jest
      .spyOn(appService, 'sendRequest')
      .mockImplementation(() => Promise.reject(error));
    await expect(appService.handleRequest(testUrl)).rejects.toEqual(
      new HttpException('Http Exception', 503),
    );
  });


  it('should throw Http exception due to timeout', async () => {
    let testUrl = 'http://localhost:3000/request-handler/balance';

    configHandlerService.timeoutDuration = 3000;
    jest.spyOn(appService, 'sendRequest').mockImplementation(async () => {
       await delay(50000) //long timeout
      return Promise.resolve('31')
    });
    await expect(appService.handleRequest(testUrl)).rejects.toEqual(new HttpException('Http Exception', 503));
  });

  it('should throw Http exception due to negative timeout', async () => {
    let testUrl = 'http://localhost:3000/request-handler/balance';

    configHandlerService.timeoutDuration = -10;
    jest.spyOn(appService, 'sendRequest').mockImplementation(async () => {
       await delay(0) //minimum required 0ms "delay" for test to have an async call
      return Promise.resolve('31')
    });
    await expect(appService.handleRequest(testUrl)).rejects.toEqual(new HttpException('Http Exception', 503));
  });

  it('should thow Http Excpetion due to Circuit Breaker open', async () => {
    let testUrl = 'http://localhost:3000/request-handler/balance';
    configHandlerService.consecutiveFailures = 1;
    appService.setupBreaker();

    jest
      .spyOn(appService, 'sendRequest')
      .mockImplementation(() => Promise.reject(error));

    //one failed requests for CB to open
    try {
      await appService.handleRequest(testUrl);
    } catch (error) {
     // system would create log from error but ignore here in test as errors are just forced for CB to open
    }
    
    //set request back to success
    jest.spyOn(appService, 'sendRequest').mockImplementation(async () => {
       await delay(0) 
      return Promise.resolve('31')
    });

    await expect(appService.handleRequest(testUrl)).rejects.toEqual(new HttpException('Http Exception', 503));
  }); 

  

  function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }
});
