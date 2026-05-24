import {ApiProperty} from '@nestjs/swagger';
import{
    IsString,
    IsNotEmpty,
    IsArray,
    IsEnum,
    ArrayMinSize,
} from 'class-validator';
import { Cuisine } from '../../restaurants/restaurant.schema';

export class CreateUserDto {
    @ApiProperty({
        example: 'Abdelrahman Salah',
        description: 'Full name of the user',
    })
    @IsString()
    @IsNotEmpty()
    fullName!: string;

    @ApiProperty({
        enum: Cuisine,
        isArray: true,
        example: [Cuisine.FRIED, Cuisine.ASIAN],
        description: 'List of user\'s favorite cuisines, which is used for recommendations',
    })
    @IsArray()
    @ArrayMinSize(1, { message: 'At least select one favorite cuisine' })
    @IsEnum(Cuisine, 
        { each: true, message: `Each favorite cuisine must be one of : ${Object.values(Cuisine).join(", ")}` })
    favoriteCuisines!: Cuisine[];
}