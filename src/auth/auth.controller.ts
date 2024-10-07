import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  // 간단한 유효성 검사를 추가한 회원가입 엔드포인트
  @Post('register')
  async register(@Body() body: any) {
    const { email, password } = body;

    // 이메일 형식 간단 검증 (정규식)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email || !emailRegex.test(email)) {
      throw new BadRequestException('Invalid email format');
    }

    // 비밀번호 최소 길이 검증
    if (!password || password.length < 6) {
      throw new BadRequestException('Password must be at least 6 characters long');
    }

    // 이메일 중복 체크
    const existingUser = await this.userService.findOne(email);
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    // 사용자 생성
    await this.userService.create(email, password);
    return { message: 'User registered successfully' };
  }

  // 로그인 엔드포인트
  @Post('login')
  async login(@Body() body: any) {
    const { email, password } = body;
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      return { message: 'Login failed' };
    }
    return this.authService.login(user);
  }
}