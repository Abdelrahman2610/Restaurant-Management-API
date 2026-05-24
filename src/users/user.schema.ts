import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Cuisine } from '../restaurants/restaurant.schema';

@Schema({ timestamps: true })
export class User extends Document {
  @ApiProperty({
    example: 'Abdelrahman Salah',
  })
  @Prop({ required: true, trim: true })
  fullName!: string;

  @ApiProperty({
    enum: Cuisine,
    isArray: true,
    example: [Cuisine.FRIED, Cuisine.ASIAN],
    description: 'List of user\'s favorite cuisines, which is used for recommendations',
  })
  @Prop({ type: [String], enum: Object.values(Cuisine) })
  favoriteCuisines!: Cuisine[];
}

export const UserSchema = SchemaFactory.createForClass(User);