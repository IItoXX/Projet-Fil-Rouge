import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SecuriteModule } from '../securite/securite.module';
import { Stock } from './stock.entity';
import { StocksService } from './stocks.service';
import { StocksController } from './stocks.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Stock]), SecuriteModule],
    controllers: [StocksController],
    providers: [StocksService],
})
export class StocksModule
{
}