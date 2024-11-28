import { Module } from '@nestjs/common/decorators/modules';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbdatasource } from 'data.source';
import { ApiModule } from './api/api.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: .env.local,
      isGlobal: true,
    }),
    ApiModule,
    TypeOrmModule.forRoot(dbdatasource),
  ],
  providers: [],
})
export class AppModule {}
