import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { HydratedDocument } from 'mongoose';

export type BlogDocument = HydratedDocument<Blog>;

@Schema()
export class Blog {
  @Prop({ type: ObjectId, required: true, default: new ObjectId() })
  _id: ObjectId;

  @Prop({ required: true, default: '' })
  id: string;

  @Prop({
    required: true,
    default: 'No name',
    maxlength: [15, 'name is too long'],
  })
  name: string;

  @Prop({
    required: true,
    default: 'No description',
    maxlength: [500, 'description is too long'],
  })
  description: string;

  @Prop({
    required: true,
    default: 'No websiteUrl',
    maxlength: [100, 'websiteUrl is too long'],
  })
  websiteUrl: string;

  @Prop({ required: true, default: new Date().toISOString() })
  createdAt: string;

  @Prop({ required: true, default: false })
  isMembership: boolean;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
