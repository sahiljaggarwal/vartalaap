import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
@Schema({ timestamps: true })
export class Profile {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
  })
  user: mongoose.Types.ObjectId;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ default: null })
  online: boolean;

  @Prop({ default: null })
  lastSeen: Date;

  @Prop()
  location: string;

  @Prop()
  about: string;

  @Prop()
  image: string;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
