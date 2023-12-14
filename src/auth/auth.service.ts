import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from './auth.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async findOrCreateUser(
    googleId: string,
    displayName: string,
    email: string,
  ): Promise<User> {
    let user = await this.userModel.findOne({ googleId });

    if (!user) {
      console.log('user not found');
      user = await this.userModel.create({ googleId, displayName, email });
    }

    return user;
  }

  async generateJwtToken(user: User): Promise<string> {
    const payload = {
      sub: user.id,
      email: user.email,
      _id: user._id,
    };
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('secretKey'),
      expiresIn: '365d',
    });
  }

  // token varification and get user
  async verifyToken(token: string): Promise<any> {
    const decodedToken = await this.jwtService.verify(token, {
      secret: this.configService.get<string>('secretKey'),
    });
    const user = await this.userModel.findById(decodedToken._id);
    if (!user) {
      throw new Error('Invalid token Or User Not Found');
    }
    return user;
  }
}
