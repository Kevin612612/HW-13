import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { HydratedDocument } from 'mongoose';

export type PostDocument = HydratedDocument<Post>;

@Schema()
export class NewestLikes {
  @Prop()
  userId: string;

  @Prop()
  login: string;

  @Prop()
  addedAt: string;
}

export const NewestLikesSchema = SchemaFactory.createForClass(NewestLikes);

@Schema()
export class ExtendedLikesInfo {
  @Prop()
  likesCount: number;

  @Prop()
  dislikesCount: number;

  @Prop()
  myStatus: string;

  @Prop({ type: [NewestLikesSchema] })
  newestLikes: any[];
}

export const ExtendedLikesInfoSchema = SchemaFactory.createForClass(ExtendedLikesInfo);

@Schema()
export class UserAsses {
  @Prop()
  userIdLike: string;

  @Prop()
  assess: string;
}

export const UserAssesSchema = SchemaFactory.createForClass(UserAsses);

@Schema()
export class Post {
  @Prop({ type: ObjectId, required: true, default: new ObjectId() })
  _id: ObjectId;

  @Prop({ required: true, default: '' })
  id: string;

  @Prop({
    required: true,
    default: 'No title',
    maxlength: [30, 'title is too long'],
  })
  title: string;

  @Prop({
    required: true,
    default: 'No shortDescription',
    maxlength: [100, 'shortDescription is too long'],
  })
  shortDescription: string;

  @Prop({
    required: true,
    default: 'No content',
    maxlength: [1000, 'content is too long'],
  })
  content: string;

  @Prop({
    required: true,
    default: 'No blogId',
  })
  blogId: string;

  @Prop({
    required: true,
    default: 'No blogName',
  })
  blogName: string;

  @Prop({ required: true, default: new Date() })
  createdAt: string;

  @Prop({ type: ExtendedLikesInfoSchema, required: true })
  extendedLikesInfo: any;

  @Prop({ type: [UserAssesSchema] })
  userAssess: any;
}

export const PostSchema = SchemaFactory.createForClass(Post);
