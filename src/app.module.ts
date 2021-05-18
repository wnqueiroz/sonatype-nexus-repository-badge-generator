import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RepositoriesModule } from './repositories/repositories.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RepositoriesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
