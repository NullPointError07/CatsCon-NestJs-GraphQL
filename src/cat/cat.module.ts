import { Module } from '@nestjs/common';
import { CatService } from './cat.service';
import { CatResolver } from './cat.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Cat, CatSchema } from './entities/cat.entity';
import { ThrottlerModule, ThrottlerModuleOptions } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { GqlThrottlerGuard } from 'src/Middlewares/graphql-throttling.middleware';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cat.name, schema: CatSchema }]),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): ThrottlerModuleOptions => [
        {
          ttl: configService.getOrThrow<number>('UPLOAD_RATE_TTL'),
          limit: configService.getOrThrow<number>('UPLOAD_RATE_LIMIT'),
        },
      ],
    }),
  ],
  providers: [
    CatResolver,
    CatService,
    {
      provide: APP_GUARD,
      useClass: GqlThrottlerGuard,
    },
  ],
})
export class CatModule {}
