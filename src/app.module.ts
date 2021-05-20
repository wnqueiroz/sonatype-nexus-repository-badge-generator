import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

import { RepositoriesModule } from './repositories/repositories.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().default(8082),
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'staging')
          .required(),
        NEXUS_SERVER_URL: Joi.string().required(),
        NEXUS_USER_NAME: Joi.string(),
        NEXUS_USER_PASS: Joi.string(),
      }),
    }),
    RepositoriesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
