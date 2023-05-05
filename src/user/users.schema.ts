import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ObjectId } from "mongodb";
import { HydratedDocument } from "mongoose";


export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({type: ObjectId, required: true, default: new ObjectId()})
  _id: ObjectId;

  @Prop({required: true, default: '1000'})
  id: string;

  @Prop({required: true, default: 'No name', minlength: [3, 'login is too short'],
  maxlength: [10, 'login is too long'],})
  login: string

  @Prop({required: true, default: '1234', minlength: [6, 'password is too short'],
  maxlength: [20, 'password is too long'],})
  password: string

  @Prop({required: true, default: 'No email', matches: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$'})
  email: string

  @Prop({required: true, default: new Date()})
  createdAt: string
}

export const UserSchema = SchemaFactory.createForClass(User);
