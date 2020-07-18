import { Controller, Post, Put, Body } from "@nestjs/common";
import { ConfigHandlerService } from "./config-handler.service";
import { ConfigDTO } from "../config-handler/dto/config.dto";
import { AppService } from "src/app.service";

/**
 * Handels the requests that change the config of the circuitBreaker
 */
@Controller('config')
export class ConfigHandlerController {

    constructor(
        private configHandlerService : ConfigHandlerService,
        private appService: AppService
    )  {}

    /**
     * Handels the put request that sends the current config for the circuitBreaker
     * Calls the function that changes the config
     * 
     * @param config The config received in the body of the put request
     * 
     * @returns Returns the values the config was changed to.
     */
    @Put()
    getConfig(@Body() config :ConfigDTO) {
        console.log(config);
        this.configHandlerService.setBreakerConfig(config);
        this.appService.setupBreaker();
        return 'Changed config! to: ' + JSON.stringify(config);
    }
}