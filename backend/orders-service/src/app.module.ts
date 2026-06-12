import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommandesModule } from './commandes/commandes.module';
import { Commande } from './commandes/commande.entity';
import { LigneCommande } from './commandes/ligne-commande.entity';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get<string>('DB_HOST', 'postgres'),
                port: configService.get<number>('DB_PORT', 5432),
                username: configService.get<string>('DB_USER', 'flapazon'),
                password: configService.get<string>('DB_PASSWORD', 'testtest'),
                database: configService.get<string>('DB_NAME', 'flapazon_orders'),
                entities: [Commande, LigneCommande],
                synchronize: true,
            }),
        }),
        CommandesModule,
    ],
})
export class AppModule
{
}