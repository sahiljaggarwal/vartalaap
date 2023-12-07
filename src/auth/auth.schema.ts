import { Document } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  email: string;

  @Prop()
  displayName: string;

  @Prop({ required: true })
  googleId: string;

  @Prop({ default: Date.now })
  date: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
