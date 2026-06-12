import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function demarrer()
{
    const application = await NestFactory.create(AppModule);
    application.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

    const configSwagger = new DocumentBuilder()
        .setTitle('Flapazon - Service Stocks')
        .setDescription('Gestion des quantites par produit et par magasin')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(application, configSwagger);
    SwaggerModule.setup('docs', application, document);

    const port = process.env.STOCKS_PORT ?? 3003;
    await application.listen(port);
}

demarrer();