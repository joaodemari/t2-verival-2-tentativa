import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './domain/auth.service';
import { LoginDto } from './dto/auth.dto';
import { AuthGuard } from './auth.guard';

@ApiTags('Login')
@Controller('login')
export class AuthController {
  constructor(public authService: AuthService) {}

  @ApiResponse({ status: 201, description: 'SignIn successfull.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 400, description: 'User not found.' })
  @Post()
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get('/me')
  getCurrentUser(@Req() req: any) {
    return req.user;
  }
}
