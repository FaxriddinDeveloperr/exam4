import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VerifyService } from './verify.service';
import { OtpDto, SentGmaildto } from 'src/user/dto/sentemail-user.dto';

@Controller('verify')
export class VerifyController {
  constructor(private readonly verifyService: VerifyService) {}
  @Post("verify_Otp")
  verify(@Body() data: OtpDto){
    return this.verifyService.VerifyOTP(data)
  }
  @Post("sendOtp")
  sendOtp(@Body() gmail: SentGmaildto){
    return this.verifyService.SendOtp(gmail)
  }
}