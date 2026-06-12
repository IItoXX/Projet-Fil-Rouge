import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { AppModule } from './app.module';

const ROUTES_INTERNES = ['/stocks/decrementer', '/stocks/incrementer'];

async function demarrer()
{
    const application = await NestFactory.create(AppModule, { bodyParser: false });

    application.use(helmet());
    application.enableCors({
        origin: process.env.FRONTEND_URL ?? 'http://localhost:4200',
        credentials: true,
    });
    application.use(rateLimit({
        windowMs: 60000,
        max: 200,
        standardHeaders: true,
        legacyHeaders: false,
    }));

    application.use((requete, reponse, suite) =>
    {
        if (ROUTES_INTERNES.some((route) => requete.path.startsWith(route)))
        {
            return reponse.status(403).json({ message: 'Endpoint interne non accessible via la passerelle' });
        }
        suite();
    });

    const services = [
        { prefixe: '/auth', cible: process.env.AUTH_URL ?? 'http://localhost:3001' },
        { prefixe: '/produits', cible: process.env.PRODUCTS_URL ?? 'http://localhost:3002' },
        { prefixe: '/stocks', cible: process.env.STOCKS_URL ?? 'http://localhost:3003' },
        { prefixe: '/commandes', cible: process.env.ORDERS_URL ?? 'http://localhost:3004' },
    ];
    for (const service of services)
    {
        application.use(createProxyMiddleware({
            pathFilter: service.prefixe,
            target: service.cible,
            changeOrigin: true,
        }));
    }

    const port = process.env.GATEWAY_PORT ?? 3000;
    await application.listen(port);
}

demarrer();