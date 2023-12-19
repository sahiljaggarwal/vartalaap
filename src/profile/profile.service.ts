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
import { fileURLToPath } from 'url';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile.name) private readonly profileModel: Model<Profile>,
    private configService: ConfigService,
  ) {}

  // create new profile
  async createProfile(
    profileData: ProfileDto,
    image: any,
    id: any,
  ): Promise<any> {
    if (!profileData.username) {
      throw new BadRequestException('username is required');
    }
    const newProfile = await new this.profileModel({
      user: id,
      ...profileData,
    });
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
    // const objectId = new mongoose.Types.ObjectId(id);
    const profile = await this.profileModel.findOne({ user: id });
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
    // Replace backslashes with forward slashes
    const normalizedPath = imagePath.replace(/\\/g, '/');
    if (!fs.existsSync(normalizedPath)) {
      console.error(`Directory does not exist: ${normalizedPath}`);
      return;
    }

    // Log whether the file exists before attempting to delete it
    fs.access(normalizedPath, fs.constants.F_OK, (err) => {
      if (err) {
        console.error(`File does not exist at path: ${normalizedPath}`);
        return;
      }

      // Delete the image file
      fs.unlink(normalizedPath, (unlinkErr) => {
        if (unlinkErr) {
          console.error(`Error deleting image file: ${unlinkErr.message}`);
        } else {
          console.log('Image file deleted successfully.');
        }
      });
    });
  }

  async updateProfile(
    id: string,
    profileData: ProfileDto,
    image: any,
  ): Promise<any> {
    const existingProfile = await this.profileModel.findOne({ user: id });
    if (profileData.username) {
      existingProfile.username = profileData.username;
    }
    if (profileData.location) {
      existingProfile.location = profileData.location;
    }
    if (profileData.about) {
      existingProfile.about = profileData.about;
    }
    if (image) {
      if (existingProfile.image) {
        this.deleteImage(existingProfile.image);
      }
      existingProfile.image = image.path;
    }
    await existingProfile.save();
    return existingProfile;
  }

  // change user profile online status
  async changeToOnlineStatus(id: string): Promise<any> {
    const profile = await this.profileModel.findOne({ user: id });
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    profile.online = true;
    profile.lastSeen = null;
    await profile.save();
  }

  // change user profile offline status
  async changeToOfflineStatus(id: string): Promise<any> {
    const profile = await this.profileModel.findOne({ user: id });
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    profile.online = false;
    profile.lastSeen = new Date();
    await profile.save();
  }
}
