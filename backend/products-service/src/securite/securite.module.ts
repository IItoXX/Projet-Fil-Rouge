import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { RolesGuard } from './roles.guard';

@Module({
    imports: [ConfigModule, PassportModule],
    providers: [JwtStrategy, RolesGuard],
    exports: [RolesGuard],
})
export class SecuriteModule
{
}