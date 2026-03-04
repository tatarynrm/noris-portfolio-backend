"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Noris Portfolio API')
        .setDescription('API documentation for the Noris Portfolio backend')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const documentFactory = () => swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, documentFactory);
    app.enableCors({
        origin: true,
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