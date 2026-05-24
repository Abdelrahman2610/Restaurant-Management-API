import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';  


// Types of Cuisines used for both validation and Swagger documentation 

export enum Cuisine {

  FRIED = 'Fried',
  ASIAN = 'Asian',
  BURGERS = 'Burgers',
  PIZZA = 'Pizza',
  SUSHI = 'Sushi',
  MEXICAN = 'Mexican',
  INDIAN = 'Indian',
  VEGETARIAN = 'Vegetarian',
  VEGAN = 'Vegan',
  ITALIAN = 'Italian',
  SEAFOOD = 'Seafood',
}

// GeoJSON sub-schema for MongoDB geospatial queries
export class GeoPoint {
  @ApiProperty({
    example: 'Point',
    enum: ['Point'],
  })
  type!: 'Point';

  @ApiProperty({
    example: [31.2357, 30.0444],
    description: 'Coordinates in [longitude, latitude] format',
  })
  coordinates!: [number, number];
}

const GeoPointSchema = new MongooseSchema({
  type: { type: String, enum: ['Point'], default: 'Point' },
  coordinates: { type: [Number], required: true },
},
 { _id: false },
);

// Main Restaurant schema definition
@Schema({ timestamps: true })

export class Restaurant extends Document {
  @ApiProperty({
    example: 'The Golden Fork',
  })
  @Prop({ required: true , trim: true })
  nameEn!: string;

  @ApiProperty({
    example: 'الشوكة الذهبية',
  })
  @Prop({ required: true, trim: true })
  nameAr!: string;

  @ApiProperty({
    example: 'the-golden-fork',
    description: 'Unique URL identifier for the restaurant',
  })
  @Prop({ required: true, unique: true , lowercase: true, trim: true })
  slug!: string;

  @ApiProperty({
    enum: Cuisine,
    isArray: true,
    example: [Cuisine.FRIED, Cuisine.ASIAN],
    description: 'List of cuisines offered by the restaurant between 1 and 3 cuisines',
  })
  @Prop({ type: [String], enum: Object.values(Cuisine) })
  cuisines!: Cuisine[];

  @ApiProperty({
    type: GeoPoint,
  })  @Prop({
    type: GeoPointSchema, required: true,
  })
  location!: {type: String ; coordinates: number[]};
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);

// Geospartial index required for queries on the location field
RestaurantSchema.index({ location: '2dsphere' });