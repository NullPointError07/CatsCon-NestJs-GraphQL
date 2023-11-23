// ThrottlerModule.forRootAsync({
//     imports: [ConfigModule],
//     inject: [ConfigService],
//     useFactory: (configService: ConfigService): ThrottlerModuleOptions => {
//       const ttl = parseInt(configService.getOrThrow('UPLOAD_RATE_TTL'));
//       const limit = parseInt(configService.getOrThrow('UPLOAD_RATE_LIMIT'));

//       console.log('Throttler Configuration:', { ttl, limit });

//       return [
//         {
//           ttl,
//           limit,
//         },
//       ];
//     },
//   }),
