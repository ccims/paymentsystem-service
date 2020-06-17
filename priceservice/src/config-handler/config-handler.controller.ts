import { Controller, Post, Put, Body } from "@nestjs/common";
import { ConfigHandlerService } from "./config-handler.service";
import { ConfigDTO } from "src/config-handler/dto/config.dto";


@Controller('config')
export class ConfigHandlerController {

    constructor( private configHandlerService : ConfigHandlerService)  {}
    @Put()
    getConfig(@Body() config :ConfigDTO) {
        console.log(config);
        console.log("Got request");
        this.configHandlerService.setBreakerConfig(config);
        return 'Changed config! to: ' + JSON.stringify(config);
    }
}