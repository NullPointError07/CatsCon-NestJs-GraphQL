import { Module } from '@nestjs/common';
import { AppResolver } from './app.resolver';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { CatModule } from './cat/cat.module';
import { AuthModule } from './auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads/catVideos'),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads/profilePic'),
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const options: MongooseModuleOptions = {
          uri: configService.get<string>('MONGO_URI'),
        };
        return options;
      },
    }),
    ConfigModule.forRoot({
      cache: true,
    }),
    UserModule,
    CatModule,
    AuthModule,
  ],
  controllers: [],
  providers: [AppService, AppResolver],
})
export class AppModule {}
