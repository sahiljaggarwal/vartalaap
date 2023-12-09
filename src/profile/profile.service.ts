import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Profile } from './profile.schema';
import { Model } from 'mongoose';
import { ProfileDto } from 'src/dtos/profile.dto';
import mongoose from 'mongoose';
import { ConfigService } from '@nestjs/config';

import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile.name) private readonly profileModel: Model<Profile>,
    private configService: ConfigService,
  ) {}

  // create new profile
  async createProfile(profileData: ProfileDto, image: any): Promise<any> {
    if (!profileData.username) {
      throw new BadRequestException('username is required');
    }
    const newProfile = await new this.profileModel({ ...profileData });
    if (image) {
      try {
        const profileImage = image.path;
        const url = this.configService.get<string>('URL');
        newProfile.image = `${url}/${profileImage}`;
      } catch (error) {
        console.log(error);
        console.log('image uploading error');
      }
    }
    await newProfile.save();
    return newProfile;
  }

  // get profile by Id
  async getProfileById(id: string): Promise<any> {
    const objectId = new mongoose.Types.ObjectId(id);
    const profile = await this.profileModel.findById(objectId);
    if (!profile) {
      throw new NotFoundException('profile not found');
    }
    return profile;
  }

  // search profile
  private prepareSearchQuery(username: string): { username: RegExp } {
    const formatted = new RegExp(username, 'i');
    return { username: formatted };
  }

  async search(username: string): Promise<{ profile: Profile[] }> {
    console.log('title, ', username);
    const profileResult = await this.profileModel
      .find(this.prepareSearchQuery(username))
      .exec();

    return { profile: profileResult };
  }

  // update user profile
  private deleteImage(imagePath: string): void {
    // Construct the full path to the image file
    const fullPath = path.join(__dirname, '..', 'uploads', imagePath);

    // Delete the image file
    fs.unlink(fullPath, (err) => {
      if (err) {
        console.error(`Error deleting image file: ${err.message}`);
      }
    });
  }

  // async updateProfile(
  //   id: string,
  //   profileData: ProfileDto,
  //   image: any,
  // ): Promise<any> {
  //   const existingProfile = await this.profileModel.findOne({ user: id });
  //   if (profileData.username) {
  //     existingProfile.username = profileData.username;
  //   }
  //   if (profileData.location) {
  //     existingProfile.location = profileData.location;
  //   }
  //   if (profileData.about) {
  //     existingProfile.about = profileData.about;
  //   }
  //   if (image) {
  //     if (existingProfile.image) {
  //       this.deleteImage(existingProfile.image);
  //     }
  //   }
  // }
}
