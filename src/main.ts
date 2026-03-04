import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configure Swagger
  const config = new DocumentBuilder()
    .setTitle('Noris Portfolio API')
    .setDescription('API documentation for the Noris Portfolio backend')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  // Required for external frontend connectivity
  app.enableCors({
    origin: ['https://noriscompany.site', 'http://localhost:3000', 'http://localhost:5005', 'http://localhost:3001', 'http://localhost:8081'],// Reflects the request origin in the Access-Control-Allow-Origin header
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization', 'X-Requested-With'],
  });

  const port = process.env.PORT || 5005;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap().catch((err) => console.error(err));
