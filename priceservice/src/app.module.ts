import { Module, HttpModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigHandlerController } from './config-handler/config-handler.controller';
import { ConfigHandlerService } from './config-handler/config-handler.service';

@Module({
  imports: [HttpModule],
  controllers: [AppController, ConfigHandlerController],
  providers: [AppService, ConfigHandlerService],
})
export class AppModule {}
