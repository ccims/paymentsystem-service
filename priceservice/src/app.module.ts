import { Module, HttpModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigHandlerModule } from './config-handler/config-handler.module';
import { LoggingModule } from "logging-module";
import { PrometheusModule, makeCounterProvider } from "@willsoto/nestjs-prometheus";

@Module({
  imports:
    [ConfigHandlerModule,
      HttpModule,
      LoggingModule,
      PrometheusModule.register()
    ],
  controllers: [AppController],
  providers:
    [
      AppService,
      makeCounterProvider({
        name: "error_response_total",
        help: "check if error response is returned"
      }),
      makeCounterProvider({
        name: "cpu_utilization",
        help: "check whether cpu utilization is too high"
      }),
      makeCounterProvider({
        name: "timeout",
        help: "check whether response time was exceeded"
      })

    ],
})

export class AppModule { }
