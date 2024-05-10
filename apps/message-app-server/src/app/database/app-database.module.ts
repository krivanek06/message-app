import { Module } from '@nestjs/common';
import { AppDatabaseService } from './app-database';

@Module({
  providers: [AppDatabaseService],
  exports: [AppDatabaseService],
})
export class AppDatabaseModule {}
