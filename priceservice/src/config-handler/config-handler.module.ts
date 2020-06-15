import { Module } from "@nestjs/common";
import { ConfigHandlerService } from "./config-handler.service";
import { ConfigHandlerController } from "./config-handler.controller";

@Module({
    controllers : [ConfigHandlerController],
    providers : [ConfigHandlerService],
    exports : [ConfigHandlerService]
})

export class ConfigHandlerModule {}