import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function demarrer()
{
    const application = await NestFactory.create(AppModule);
    application.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

    const configSwagger = new DocumentBuilder()
        .setTitle('Flapazon - Service Commandes')
        .setDescription('Creation, validation et suivi des commandes')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(application, configSwagger);
    SwaggerModule.setup('docs', application, document);

    const port = process.env.ORDERS_PORT ?? 3004;
    await application.listen(port);
}

demarrer();