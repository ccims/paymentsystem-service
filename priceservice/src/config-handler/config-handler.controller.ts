import { Controller, Post, Put, Body } from "@nestjs/common";
import { ConfigHandlerService } from "./config-handler.service";
import { ConfigDTO } from "../config-handler/dto/config.dto";

/**
 * Handels the requests that change the config of the circuitBreaker
 */
@Controller('config')
export class ConfigHandlerController {

    constructor( private configHandlerService : ConfigHandlerService)  {}

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
        console.log("Got request");
        this.configHandlerService.setBreakerConfig(config);
        return 'Changed config! to: ' + JSON.stringify(config);
    }
}