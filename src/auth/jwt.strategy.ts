import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 헤더에서 토큰 추출
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET, // 환경 변수에 설정된 JWT 시크릿 사용
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email }; // 토큰에서 사용자 정보 반환
  }
}