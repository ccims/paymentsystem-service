import { Module, HttpModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigHandlerModule } from './config-handler/config-handler.module';
import { LoggingModule } from "logging-module";

@Module({
  imports: [ConfigHandlerModule, HttpModule, LoggingModule],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
