import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UtilisateursModule } from './utilisateurs/utilisateurs.module';
import { Utilisateur } from './utilisateurs/utilisateur.entity';

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
                database: configService.get<string>('DB_NAME', 'flapazon_auth'),
                entities: [Utilisateur],
                synchronize: true,
            }),
        }),
        AuthModule,
        UtilisateursModule,
    ],
})
export class AppModule
{
}