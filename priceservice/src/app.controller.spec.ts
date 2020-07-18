import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigHandlerService } from './config-handler/config-handler.service';
import { HttpModule } from '@nestjs/common';

describe('ResponseModification Controller', () => {
    jest.mock("./app.service");
       jest.mock('./config-handler/config-handler.service');


    let controller: AppController;
    let appService: AppService;
    let configHandlerService: ConfigHandlerService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AppController],    
            imports: [HttpModule] ,       
            providers: [AppService, ConfigHandlerService]
        }).compile();

        controller = module.get<AppController>(AppController);
        appService = module.get<AppService>(AppService);
        configHandlerService = module.get<ConfigHandlerService>(ConfigHandlerService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

});
