import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RoleDocument = Role & Document;

@Schema({ timestamps: true })
export class Role {
  @Prop({ required: true, unique: true })
  name: string; // VD: Content Editor

  @Prop()
  description: string;

  @Prop([String])
  permissions: string[]; // VD: ['COURSE_VIEW', 'COURSE_CREATE']

  @Prop({ default: false })
  isSystem: boolean;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
