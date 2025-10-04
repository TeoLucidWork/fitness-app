import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  ValidationPipe,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body(ValidationPipe) registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body(ValidationPipe) loginDto: LoginDto, @Request() req) {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }


  @UseGuards(JwtAuthGuard)
  @Get('clients')
  async getClients(@Request() req) {
    return this.authService.getTrainerClients(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('generate-registration-link')
  async generateRegistrationLink(@Request() req) {
    return this.authService.generateRegistrationToken(req.user.id);
  }

  @Post('register-with-token')
  async registerWithToken(
    @Body(ValidationPipe) registerDto: RegisterDto,
    @Body('token') token: string,
  ) {
    return this.authService.registerWithToken(registerDto, token);
  }

  @UseGuards(JwtAuthGuard)
  @Get('registration-tokens')
  async getRegistrationTokens(@Request() req) {
    return this.authService.getRegistrationTokens(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('clients/:id/details')
  async getClientDetails(@Request() req, @Param('id') clientId: string) {
    return this.authService.getClientDetails(req.user.id, parseInt(clientId));
  }
}
