import { Module, HttpModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigHandlerController } from './config-handler/config-handler.controller';
import { ConfigHandlerService } from './config-handler/config-handler.service';

@Module({
  imports: [HttpModule, ConfigModule.forRoot({ isGlobal: true })],
  controllers: [AppController, ConfigHandlerController],
  providers: [AppService, ConfigHandlerService],
})
export class AppModule {

}
