import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class GroupMessage {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  groupId: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  senderId: mongoose.Types.ObjectId;

  @Prop()
  group_message: string;
}
export const groupMessageSchema = SchemaFactory.createForClass(GroupMessage);
