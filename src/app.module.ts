import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CampersModule } from './campers/camper.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [DatabaseModule, CampersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
