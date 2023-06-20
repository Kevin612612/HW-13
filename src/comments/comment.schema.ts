import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { HydratedDocument } from 'mongoose';

export type PostDocument = HydratedDocument<Comment>;

@Schema()
export class CommentatorInfo {
  @Prop()
  userId: string;

  @Prop()
  userLogin: string;
}
export const CommentatorInfoSchema = SchemaFactory.createForClass(CommentatorInfo);

@Schema()
export class LikesInfo {
  @Prop()
  dislikesCount: number;

  @Prop()
  likesCount: number;

  @Prop()
  myStatus: string;
}
export const LikesInfoSchema = SchemaFactory.createForClass(LikesInfo);

@Schema()
export class UserAsses {
  @Prop()
  userIdLike: string;

  @Prop()
  assess: string;
}
export const UserAssesSchema = SchemaFactory.createForClass(UserAsses);

@Schema()
export class Comment {
  @Prop({ type: ObjectId, required: true, default: new ObjectId() })
  _id: ObjectId;

  @Prop({ required: true })
  id: string;

  @Prop({
    required: true,
    default: 'No title',
    maxlength: [5000, 'title is too long'],
  })
  content: string;

  @Prop({ type: CommentatorInfoSchema, required: true })
  commentatorInfo: any;

  @Prop({ required: true })
  postId: string;

  @Prop({ required: true, default: new Date().toISOString() })
  createdAt: string;

  @Prop({ type: LikesInfoSchema, required: true })
  likesInfo: any;

  @Prop({ type: [UserAssesSchema] })
  userAssess: any;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
