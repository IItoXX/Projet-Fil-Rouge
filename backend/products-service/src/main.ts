import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function demarrer()
{
    const application = await NestFactory.create(AppModule);
    application.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

    const configSwagger = new DocumentBuilder()
        .setTitle('Flapazon - Service Produits')
        .setDescription('Catalogue global des produits')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(application, configSwagger);
    SwaggerModule.setup('docs', application, document);

    const port = process.env.PRODUCTS_PORT ?? 3002;
    await application.listen(port);
}

demarrer();