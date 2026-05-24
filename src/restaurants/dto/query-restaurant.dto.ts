import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsNumber, Min } from 'class-validator';
import { Cuisine } from '../restaurant.schema';
import { Type } from 'class-transformer';

//Used for GET/restaurants
export class ListRestaurantsDto{
    @ApiPropertyOptional({
        enum: Cuisine,
        description: 'Filter restaurants by cuisine type',
        example: Cuisine.PIZZA,
    })
    @IsOptional()
    @IsEnum(Cuisine, 
        { message: 'Cuisine must be one of : ${Object.values(Cuisine).join(", ")}' })
    cuisine?: Cuisine;
}

//Used for GET/restaurants/nearby
export class NearbyRestaurantsDto {
    @ApiPropertyOptional({
        description: 'Longitude',
        example: 31.2357,
    })
    @IsNumber()
    @Type(() => Number)
    longitude!: number;
    
    @ApiPropertyOptional({
        description: 'Latitude',
        example: 30.0444,
    })
    @IsNumber()
    @Type(() => Number)
    latitude!: number;

    @ApiPropertyOptional({
        description: 'search radius in meters (default: 1000m =1km)',
        example: 1000,
        default: 1000,
    })
    @IsOptional()
    @IsNumber()
    @Min(1)
    @Type(() => Number)
    radius?: number = 1000;
    }