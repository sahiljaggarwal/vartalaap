import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Chat {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  sender: mongoose.Types.ObjectId;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  receiver: mongoose.Types.ObjectId;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId }] })
  messages: mongoose.Types.ObjectId[];
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
