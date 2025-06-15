import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { EarningsService } from './earnings.service';
import { JwtAuthGuard } from 'src/libs/auth-guard/AuthGuard';
@UseGuards(JwtAuthGuard)
@Controller('earnings')
export class EarningsController {
  constructor(private readonly earningsService: EarningsService) {}

  @Get('/')
  async getEarnings(@Query() query: any) {
    return await this.earningsService.getEarnings(query);
  }

  @Get("payments")
  async getPaymentHistory(@Query() query: any) {
    return await this.earningsService.getPaymentHistory(query);
  }

  @Get("payment-status-refernce")
  async getPaymentHistoryReferenceData(){
    return await this.earningsService.getPaymentHistoryReferenceData();
  }
}
