import { Module } from '@nestjs/common';
import { TokenService } from 'src/token/token.service';
import { DemoController } from './demo.controller';

@Module({
  controllers: [DemoController],
  providers: [TokenService],
})
export class DemoModule {}
