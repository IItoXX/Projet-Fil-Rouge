import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { RolesGuard } from './roles.guard';
import { InterneGuard } from './interne.guard';

@Module({
    imports: [ConfigModule, PassportModule],
    providers: [JwtStrategy, RolesGuard, InterneGuard],
    exports: [RolesGuard, InterneGuard],
})
export class SecuriteModule
{
}