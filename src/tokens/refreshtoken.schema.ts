import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { HydratedDocument } from 'mongoose';

export type RefreshTokenDocument = HydratedDocument<RefreshToken>;

@Schema()
export class RefreshToken {
  @Prop({ required: true, default: '' })
  _id: ObjectId;

  @Prop({ required: true, default: '' })
  value: string;

  @Prop({ required: true, default: '' })
  userId: string;

  @Prop({ required: true, default: '' })
  deviceId: string;

  @Prop({ required: true, default: '' })
  deviceName: string;

  @Prop({ required: true, default: '' })
  IP: string;

  @Prop({ required: true, default: new Date().toISOString() })
  createdAt: string;

  @Prop({ required: true, default: new Date(new Date().getTime() + (30 * 60 * 1000)).toISOString() })
  expiredAt: string;

  @Prop({ versionKey: true })
  __v: number;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
