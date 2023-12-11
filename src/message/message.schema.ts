import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Message {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  sender: mongoose.Types.ObjectId;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  receiver: mongoose.Types.ObjectId;

  @Prop({ required: true, type: mongoose.Types.ObjectId })
  chat: mongoose.Types.ObjectId;

  @Prop({ required: true })
  content: string;

  @Prop({ default: false })
  isRead: boolean;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
