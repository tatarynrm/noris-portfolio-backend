"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: false,
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Noris Portfolio API')
        .setDescription('API documentation for the Noris Portfolio backend')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const documentFactory = () => swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, documentFactory);
    app.enableCors({
        origin: ['https://noriscompany.site', 'http://localhost:3000', 'http://localhost:5005', 'http://localhost:3001', 'http://localhost:8081'],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
        allowedHeaders: ['Content-Type', 'Accept', 'Authorization', 'X-Requested-With'],
    });
    const port = process.env.PORT || 5005;
    await app.listen(port);
    console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap().catch((err) => console.error(err));
//# sourceMappingURL=main.js.map