import { 
  IsString,
  IsArray,
  IsNotEmpty,
  ArrayMinSize,
  ArrayMaxSize,
  IsEnum,
  IsNumber,
  ValidateNested,
  IsOptional,
 } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Cuisine } from '../restaurant.schema';
import { Type } from 'class-transformer';

// Nested object for location validation
class LocationDto {
  @ApiProperty({
    description: 'longitude coordinate',
    example: 31.2357,
  })
  @IsNumber()
  longitude!: number;

  @ApiProperty({
    description: 'latitude coordinate',
    example: 30.0444,
  })
  @IsNumber()
  latitude!: number;
}

export class CreateRestaurantDto {
  @ApiProperty({ 
    example: 'The Golden Fork',
    description: 'Name of the restaurant in English',})
  @IsString()
  @IsNotEmpty()
  nameEn!: string;

  @ApiProperty({ 
    example: 'الشوكة الذهبية',
    description: 'Name of the restaurant in Arabic',
   })
  @IsString()
  @IsNotEmpty()
  nameAr!: string;

  @ApiProperty({ 
    example: 'the-golden-fork',
    description: 'Unique URL identifier for the restaurant',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  slug!: string;

  @ApiProperty({
    enum: Cuisine,
    isArray: true,
    minLength: 1,
    maxLength: 3,
    example: [Cuisine.FRIED, Cuisine.ASIAN],
    description: 'List of cuisines offered by the restaurant between 1 and 3 cuisines',
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one cuisine must be specified' })
  @ArrayMaxSize(3, { message: 'No more than three cuisines can be specified' })
  @IsEnum(Cuisine, 
    { each: true,
      message: 'Each cuisine must be one of : ${Object.values(Cuisine).join(", ")}'
     })
  cuisines!: Cuisine[];

  @ApiProperty({
    type: LocationDto,
    description: 'Geographical location of the restaurant',
  })
  @ValidateNested()
  @Type(() => LocationDto)
  location!: LocationDto;
}