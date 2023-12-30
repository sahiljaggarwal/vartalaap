import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Friend {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  userId: mongoose.Types.ObjectId;

  @Prop([{ type: mongoose.Schema.Types.ObjectId }])
  friends: mongoose.Types.ObjectId[];

  @Prop([{ type: mongoose.Schema.Types.ObjectId }])
  requests: mongoose.Types.ObjectId[];

  @Prop([{ type: mongoose.Schema.Types.ObjectId }])
  blocked: mongoose.Types.ObjectId[];
}

export const friendSchema = SchemaFactory.createForClass(Friend);
