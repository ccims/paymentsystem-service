import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigHandlerService } from './config-handler/config-handler.service';
import { HttpModule } from '@nestjs/common';

describe('ResponseModification Controller', () => {
  jest.mock('./app.service');
  jest.mock('./config-handler/config-handler.service');

  let controller: AppController;
  let appService: AppService;
  let configHandlerService: ConfigHandlerService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      imports: [HttpModule],
      providers: [AppService, ConfigHandlerService],
    }).compile();

    controller = module.get<AppController>(AppController);
    appService = module.get<AppService>(AppService);
    configHandlerService = module.get<ConfigHandlerService>(
      ConfigHandlerService,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return balance of 31', async () => {
    jest
      .spyOn(appService, 'handleRequest')
      .mockImplementation(() => Promise.resolve('31'));
    expect(await controller.getBalance()).toEqual('31');
  });

  it('should return name of Jeff', async () => {
    jest
      .spyOn(appService, 'handleRequest')
      .mockImplementation(() => Promise.resolve('Jeff'));
    expect(await controller.getCustomerName()).toEqual('Jeff');
  });

  it('should return account worth of 3000', async () => {
    let res;
    jest
      .spyOn(appService, 'handleRequest')
      .mockImplementation(() => Promise.resolve('3000'));
    expect(await controller.requestAccountValue(res)).toEqual('3000');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
});
