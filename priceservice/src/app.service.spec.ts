import { AppService } from './app.service';
import { TestingModule, Test, TestingModuleBuilder } from '@nestjs/testing';
import { ConfigHandlerService } from './config-handler/config-handler.service';
import { HttpModule, HttpException } from '@nestjs/common';
import { error } from 'console';
import { ConfigService } from '@nestjs/config';

describe('AppService', () => {
  let appService: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [AppService, ConfigHandlerService, ConfigService],
    }).compile();

    appService = module.get<AppService>(AppService);
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
});
