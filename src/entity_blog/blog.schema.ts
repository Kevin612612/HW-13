import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { HydratedDocument } from 'mongoose';

export type BlogDocument = HydratedDocument<Blog>;

@Schema({ _id : false })
export class BlogOwner {
  @Prop()
  userId: string;

  @Prop()
  userLogin: string;
}
export const BlogOwnerSchema = SchemaFactory.createForClass(BlogOwner);

@Schema({ _id : false })
export class BlogBanInfo {
  @Prop({default: false})
  isBanned: boolean;

  @Prop({ default: new Date().toISOString() })
  banDate: string;
}
export const BlogBanInfoSchema = SchemaFactory.createForClass(BlogBanInfo);


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

	@Prop({ type: BlogOwnerSchema })
	blogOwnerInfo: any;

	@Prop({ type: BlogBanInfoSchema })
	banInfo: any;

	@Prop({ versionKey: true })
	__v: number;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
