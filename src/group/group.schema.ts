import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Group {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  admin: mongoose.Types.ObjectId;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId }] })
  members: mongoose.Types.ObjectId[];

  @Prop()
  name: string;

  @Prop()
  image: string;

  @Prop()
  description: string;
}

export const groupSchema = SchemaFactory.createForClass(Group);
